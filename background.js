/*
 * Message listener and sender API
 */
chrome.runtime.onMessage.addListener(
	function(arg, sender, sendResponse) {
		switch (arg['cmd']) {
		case 'play':
			speech_play();
			break;
		case 'pause':
			speech_pause();
			break;
		case 'stop':
			speech_stop();
			break;
		default:
			console.log('ERR: bad msg.');
		}
		// console.log(arg);
		// console.log(sender);
	}
);

function sendMsgToTab(msg) {
	chrome.tabs.query(
		{active: true, currentWindow: true },
		function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, msg);
		}
	);
}

/*
 * Speech play control functions.
 */
var playing_idx = -1;

function speech_play() {
	if (playing_idx != -1) {
		[a1, a2][playing_idx].play();
	}
}

function speech_pause() {
	if (playing_idx != -1) {
		[a1, a2][playing_idx].pause();
	}
}

Audio.prototype.stop = function() {
	this.pause();
	this.currentTime = 0;
};

function speech_stop() {
	if (playing_idx != -1) {
		[a1, a2][playing_idx].pause();
	}
	a1.stop();
	a2.stop();
}

/*
 * Create the two circular audio buffers.
 */
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

/*
 * TTS APIs' URL generator
 */
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

/*
 * audio high-level methods
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
		var stop_procedure = function () {
			clearInterval(IntId);
			onEnd();
		}
		if (audio.currentTime != last_cur) {
			last_cur = audio.currentTime;
			if (onTimeUpdate(audio.currentTime, audio.duration)) {
				/* callback function indicates us to stop */
				stop_procedure();
			}
		} else if (audio.ended) {
			stop_procedure();
		}
	}, 100);
}

/*
 * Text to Speech
 */
function recur_play(audio_arr, trunks, i) {
	/* go play the current trunk */
	if (0 <= i && i < trunks.length) {
		console.log(trunks[i]);
		if (audio_arr[i % 2] == null) {
			console.log('Trunk[' + i + '] is empty, abort.');
			return;
		}
		console.log('Trunk[' + i + '] plays.');
		playing_idx = i % 2;
		audio_play(
			audio_arr[i % 2],
			function onTimeUpdate(cur, dur) {
				// console.log(cur + '/' + dur);
				var left_time = dur - cur;
				if (left_time < 1.2) {
					/* start to play the next trunk */
					recur_play(audio_arr, trunks, i + 1);
					return true; /* stop this trunk */
				}
				return false;
			},
			function onEnd() {
				console.log('Trunk[' + i + '] ends.');
				if (i + 1 == trunks.length) {
					sendMsgToTab({"event": "ended", "args": {}});
					playing_idx = -1;
				}
			}
		);
	}

	/* at the same time prepare and load the next trunk */
	if (i + 1 < trunks.length) {
		url = tts_api_url('voicerss', trunks[i + 1]);
		audio_load(audio_arr[(i + 1) % 2], url, function (c) {
			if (c != 200) {
				/* download failed */
				console.log('Trunk[' + (i + 1) + '] failed to load.');
				audio_arr[(i + 1) % 2] = null;
				return;
			}
			console.log('Trunk[' + (i + 1) + '] loaded.');
			if (i < 0) {
				/* initial play */
				sendMsgToTab({"event": "loaded", "args": {}});
				recur_play(audio_arr, trunks, 0);
			}
		});
	} else if (i < trunks.length) {
		console.log('Trunk[' + i + '] is the final trunk.');
	}
}

function text2speech(text) {
	/* ignore some char that causes API to return ERR 500 */
	text = text.replace(/</g, ' ');
	text = text.replace(/>/g, ' ');

	sendMsgToTab({"event": "start", "args": {}});

	trunks = text2trunks(text);
	recur_play([a1, a2], trunks, -1);
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
	var i = 0, trunks = new Array();
	while (text != 0) {
		var next = first_trunk(text);
		var trunk = text.substr(0, next);
		text = text.substr(next);
		trunks[i++] = trunk;
	}
	return trunks;
}
