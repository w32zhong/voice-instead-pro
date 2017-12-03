function tts_api_url(api_name, text)
{
	url_voicerss = 'http://www.voicerss.org/controls/speech.ashx?';
	url = '';
	switch (api_name) {
	case 'voicerss':
		url = url_voicerss;
		url += 'hl=en-us&';
		url += 'src=' + encodeURIComponent(text);
		break;
	default:
	}

	return url;
}

var a1 = newAudioElement();
var a2 = newAudioElement();

function newAudioElement() {
	var audioElement = document.createElement('audio');
	//audioElement.setAttribute("controls", "");
	//audioElement.setAttribute("autoplay", "");
	//audioElement.setAttribute("loop", "");
	//audioElement.setAttribute("muted", "");
	audioElement.setAttribute("preload", "auto");
	//audioElement.src= '';
	audioElement.src = 'http://lezotre.free.fr/Mp3/disco.mp3';
	// document.body.appendChild(audioElement);

	return audioElement;
}

// chrome.runtime.onMessage.addListener(
//   function(arg, sender, sendResponse) {
// //	  audioElement.load;
// //	  audioElement.play();
//   }
// );

/*
 * audio GET request
 */
function audio_load(audio, url, callbk)
{
	var xhr = new XMLHttpRequest();

	xhr.addEventListener('load', function (blob) {
		// console.log('status: ' + xhr.status);
		if (xhr.status == 200) {
			audio.src = window.URL.createObjectURL(xhr.response);
		}
		callbk(xhr.status);
	});

	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send(null);
}

function audio_play(audio, onTimeUpdate, onEnd)
{
	audio.play();
	var last_cur = audio.currentTime;
	var IntId = setInterval(function() {
		if (audio.currentTime != last_cur) {
			onTimeUpdate(audio.currentTime, audio.duration);
			last_cur = audio.currentTime;
		} else if (audio.ended) {
			clearInterval(IntId);
			onEnd();
		}
	}, 100);
}

/*
 * Text to Speech
 */
function text2speech(text) {
	/* ignore some char that causes API to return ERR 500 */
	text = text.replace(/</g, ' ');
	text = text.replace(/>/g, ' ');

	trunks = text2trunks(text);
	audio_arr = [a1, a2];
	console.log(trunks);

	url = tts_api_url('voicerss', trunks[0]);
	audio_load(audio_arr[0], url, function (xhr_status) {
		audio_play(audio_arr[0],
		function onTimeUpdate(cur, dur) {
			console.log(cur + '/' + dur);
			var left_time = dur - cur;
			if (left_time < 1.2) {
				console.log('Start the next buffer!');
			}
		},
		function onEnd(cur, dur) {
			console.log('Oh end.');
		});
	});
}

/*
 * context menu
 */
function selectionOnClick(info, tab) {
	sel_txt = info.selectionText;
	text2speech(sel_txt);
}

chrome.contextMenus.create({
	"title": "Voice Instead",
	"contexts": ["selection"],
	"onclick": selectionOnClick
});

/*
 * request headers modify
 */
blockCallbk = function(details) {
    details.requestHeaders.push({
        name: 'Referer',
        value: 'http://www.voicerss.org/api/demo.aspx'
    });
    return {
        requestHeaders: details.requestHeaders
    };
};

filter = { urls: ["*://www.voicerss.org/*"] };
opts = [
	'blocking' /* allow to modify request */,
	'requestHeaders' /* if set, replace request headers with requestHeaders */
];
chrome.webRequest.onBeforeSendHeaders.addListener(blockCallbk, filter, opts);

/*
 * Text to Trunk
 */
function first_trunk(text)
{
	var sub_str = text;
	var sub_idx, idx = 0;
	var min_len = 80;
	var not_break = 1;

	while (idx < min_len && not_break) {
		/* try period/comma first */
		sub_idx = sub_str.search(/,|\.|;|\?/);

		if (sub_idx == -1 || idx + sub_idx > min_len) {
			/* then try space */
			sub_idx = sub_str.indexOf(' ');

			if (sub_idx == -1 || idx + sub_idx > min_len) {
				if (sub_idx == -1) {
					/* the next word is the last word, break */
					not_break = 0;
					//console.log('slice: add the last words.');
					idx += sub_str.length;
				} else {
					/* exceed min len, break */
					not_break = 0;
					//console.log('slice: now, I do not want more words.');
					idx += sub_idx + 1;
				}
			} else {
				//console.log('slice: increment by space, len = ' + sub_idx);
				idx += sub_idx + 1;
			}
		} else {
			//console.log('slice: increment by period/comma, len = ' + sub_idx);
			idx += sub_idx + 1;
		}

		//console.log('slice: [[' + text.substring(0, idx) + ']] idx = ' + idx + ' / 80');
		sub_str = sub_str.substr(sub_idx + 1);
	}

	return idx;
}

function text2trunks(text)
{
	var i = 0, trunks = new Object();
	while (text != 0) {
		var next = first_trunk(text);
		var trunk = text.substr(0, next);
		text = text.substr(next);
		console.log('trunk: ' + trunk);
		trunks[i++] = trunk;
	}
	return trunks;
}
