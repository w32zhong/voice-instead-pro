/*
 * Global API settings
 */
config_read(function (config) {
	g_api_settings = config;
});

/*
 * User license logic
 */
var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';

/* 
 * When browser restarts, license is reset to invalid
 * such that we regularly check user's license.
 */
//var g_license_valid = true;  /* debug */
var g_license_valid = false; /* production */

function request_pay_status(token) {
	console.log('Current license validity: ');
	console.log(g_license_valid);
	console.log('Query license ...');

	var req = new XMLHttpRequest();
	req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
	req.setRequestHeader('Authorization', 'Bearer ' + token);
	req.onreadystatechange = function() {
	  if (req.readyState == 4) {
		var license = JSON.parse(req.responseText);
		console.log('license: ');
		console.log(license);
		if (license.result == false ||
		    license.accessLevel == "FULL")
			g_license_valid = true;
		else
			g_license_valid = false;
	  }
	}
	req.send();
}

function authenticate_client() {
	console.log('Authenticate client ...');
	chrome.identity.getAuthToken({
		'interactive': true
	}, function(token) {
		if (token != undefined) {
			console.log('user token: ' + token);
			g_api_settings.user_id = token;
			request_pay_status(token);
		} else {
			console.log('user keeps unknown.');
			g_api_settings.user_id = 'Unknown';
			g_license_valid = false;
		}
	});
}

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
		{'status': 'complete'},
		function(tabs) {
			/* send msg to content script of *ALL* tabs */
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i] != undefined) {
					// console.log('msg tab['+ i + '].');
					chrome.tabs.sendMessage(tabs[i].id, msg);
				} else {
					console.log('err: msg tab['+ i + '].');
				}
			}
		}
	);
}

/*
 * Shortcut key listener.
 * Config: chrome://extensions/configureCommands
 */
chrome.commands.onCommand.addListener(function(command) {
	if(command === "speak-selected-text") {
		chrome.tabs.executeScript({
				code: "window.getSelection().toString();"
			}, function(selections) {
			speech_stop();
			if (selections == undefined) {
				text2speech("Unable to use key shortcut in this page.");
			} else {
				var sel_txt = selections[0];
				if (sel_txt == '' || sel_txt == ' ') {
					text2speech("Please select some text.");
				} else {
					text2speech(sel_txt);
				}
			}
		});
	}
});

function getShortcut() {
	chrome.commands.getAll(function (commands) {
		var i = 0;
		for (i = 0; i < commands.length; i ++) {
			var cmd = commands[i];
			if (cmd.name == "speak-selected-text") {
				g_api_settings.shortcut_keys = cmd.shortcut;
				break;
			}
		}

		if (i == commands.length)
			g_api_settings.shortcut_keys = '';
	});
}

/*
 * Speech play control functions.
 */
var g_playing_idx = -1;
var g_loading = false;
var g_loaderr = false;

function speech_play() {
	if (g_playing_idx != -1) {
		[a1, a2][g_playing_idx].play();
	}
}

function speech_pause() {
	if (g_playing_idx != -1) {
		[a1, a2][g_playing_idx].pause();
	}
}

Audio.prototype.stop = function() {
	this.pause();
	this.currentTime = 0;
};

function speech_stop() {
	if (g_playing_idx != -1) {
		[a1, a2][g_playing_idx].pause();
	}
	a1.stop();
	a2.stop();
	g_playing_idx = -1;
	g_loading = false;
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
	audioElement.src = ''; //'http://lezotre.free.fr/Mp3/disco.mp3';
	// document.body.appendChild(audioElement);

	return audioElement;
}

/*
 * TTS APIs' URL generator
 */
function tts_api_url(text)
{
	var api = g_api_settings.apiChoice;
	var apiList = g_api_settings.apiList;

	var enc_txt = g_api_settings.test_text;
	if (text != null) enc_txt = encodeURIComponent(text);

	/* get SSML parameters first */
	SSML_head_begin = encodeURIComponent('<voice-transformation');
	SSML_head_body = '';
	SSML_head_end = encodeURIComponent('>');
	SSML_tail = encodeURIComponent('</voice-transformation>');
	for (var i = 0; i < apiList[api].options.length; i++) {
		option = apiList[api].options[i];
		if (option.SSML) {
			SSML_head_body += encodeURIComponent(
				' ' + option.uri_key +
				'=' + '"' + option.choice + '"'
			);
		}
	}

	/* apply URL parameters */
	url = apiList[api].url + '?';
	for (var i = 0; i < apiList[api].options.length; i++) {
		option = apiList[api].options[i];
		if (option.uri_key.charAt(0) == '{') {
			/* REST API argument */
			var enc_choice = encodeURIComponent(option.choice);
			url = url.replace(option.uri_key, enc_choice);
		} else if (!option.SSML) {
			/* regular URI argument */
			url += option.uri_key + '=' + option.choice + '&';
		}
	}
	url += '&' + apiList[api].txt_uri_key + '=';

	/* finally encode apply the TTS text */
	if (SSML_head_body == '' || url.indexOf("en-US") == -1 /* ugly but reality */) {
		url += enc_txt;
	} else {
		url += SSML_head_begin + SSML_head_body + SSML_head_end +
		       enc_txt + SSML_tail;
	}

	return url;
}

function tts_api_voice_gap()
{
	var api = g_api_settings.apiChoice;
	var apiList = g_api_settings.apiList;
	var gap = apiList[api].voice_gap;
	//console.log('using voice gap: ' + gap)
	return gap;
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
	}, 30);
}

/*
 * Text to Speech
 */
function recur_play(audio_arr, trunks, i) {
	/* go play the current trunk */
	if (0 <= i && i < trunks.length) {
		sendMsgToTab({
			"event": "subtitle_update",
			"args": {
				'subtitle': trunks[i],
				'enable': g_api_settings.subtitle
			}
		});
		console.log('playing: ' + trunks[i]);
		if (audio_arr[i % 2] == null) {
			console.log('Trunk[' + i + '] is empty, abort.');
			return;
		}
		console.log('Trunk[' + i + '] plays.');
		g_playing_idx = i % 2;
		audio_play(
			audio_arr[i % 2],
			function onTimeUpdate(cur, dur) {
				// console.log(cur + '/' + dur);
				var left_time = dur - cur;
				if (left_time <= tts_api_voice_gap()) {
					/* start to play the next trunk */
					console.log('Left time: ' + left_time);
					recur_play(audio_arr, trunks, i + 1);
					return true; /* stop this trunk */
				} else if (cur == 0) {
					console.log('Trunk[' + i + '] aborted.');
					return true; /* stop when new speech loaded. */
				}
				return false;
			},
			function onEnd() {
				console.log('Trunk[' + i + '] ends.');
				if (i + 1 == trunks.length) {
					sendMsgToTab({"event": "ended", "args": {}});
					g_playing_idx = -1;
				}
			}
		);
	}

	/* at the same time prepare and load the next trunk */
	if (i + 1 < trunks.length) {
		url = tts_api_url(trunks[i + 1]);
		audio_load(audio_arr[(i + 1) % 2], url, function (c) {
			if (c != 200) {
				/* download failed */
				sendMsgToTab({"event": "error", "args": {}});
				g_loaderr = true;
				g_loading = false;
				console.log('Trunk[' + (i + 1) + '] failed to load.');
				audio_arr[(i + 1) % 2] = null;
				return;
			}
			console.log('Trunk[' + (i + 1) + '] loaded.');
			if (i < 0) {
				/* initial play */
				sendMsgToTab({"event": "loaded", "args": {}});
				g_loading = false;
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
	g_loaderr = false;
	g_loading = true;

	// text = "this principle also applies to proactive members of the Arch community wanting to get involved and contribute to their favorite Linux distribution and their participation benefits not only the community member and their fellow Archers but all users of free and open source software";
	// text = text + text + text;
	var api = g_api_settings.apiChoice;
	var apiList = g_api_settings.apiList;
	var min_len = apiList[api].min_len || 50;
	var max_len = apiList[api].max_len || 160;
	console.log('text2speech(min_len=' + min_len + ', ' +
	            'max_len=' + max_len + ', ' + 'gap=' +
	            tts_api_voice_gap() + ')');

	trunks = text2trunks(text, min_len, max_len);
	print_trunks(trunks);
	recur_play([a1, a2], trunks, -1);
}

/*
 * context menu
 */
function selectionOnClick(info, tab) {
	sel_txt = info.selectionText;
	speech_stop();
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

// t='，'.charCodeAt(0).toString(16)
// console.log(t); /* ff0c */
// t='、'.charCodeAt(0).toString(16)
// console.log(t); /* 3001 */
// t='。'.charCodeAt(0).toString(16)
// console.log(t); /* 3002 */
// t='；'.charCodeAt(0).toString(16)
// console.log(t); /* ff1b */
// t='？'.charCodeAt(0).toString(16)
// console.log(t); /* ff1f */

//ttsstt = "This principle also applies to proactive members of the Arch community wanting to get involved and contribute to their favorite Linux distribution and their participation benefits not only the community member and their fellow Archers but all users of free and open source software.";
//chrome.tts.speak(ttsstt);

function first_trunk(text, min_len, max_len)
{
	var sub_str = text;
	var sub_idx, idx = 0;
	var break_at_space = 0;

	while (idx < max_len) {
		/* try period/comma first */
		//console.log('slice (search period): ' + sub_str);
		sub_idx = sub_str.search(/,|\.|;|\?|\uff0c|\u3001|\u3002|\uff1b|\uff1f/);
		
		if (sub_idx == -1 || idx + sub_idx > max_len) {
			/* would be best if we break at period/comma */
			if (!break_at_space) {
				if (idx <= max_len && idx > min_len) {
					// console.log('slice: lazy break.');
					break;
				}
			}

			/* begin break-at-space */
			sub_idx = sub_str.indexOf(' ');
			break_at_space = true;

			if (sub_idx == -1 || idx + sub_idx > max_len) {
				if (sub_idx == -1) {
					/* the next word is the last word, break */
					idx += sub_str.length;
					break;
				} else {
					/* exceed max_len, break */
					idx += sub_idx + 1;
					break;
				}
			} else {
				// console.log('slice: increment by space, len = ' + sub_idx);
				idx += sub_idx + 1;
			}
		} else {
			// console.log('slice: increment by period/comma, len = ' + sub_idx);
			idx += sub_idx + 1;
		}

		sub_str = sub_str.substr(sub_idx + 1);
	}

	// console.log('slice: [[' + text.substring(0, idx) + ']]');
	// console.log('slice: return final idx = ' + idx);
	return idx;
}

function text2trunks(text, min_len, max_len)
{
	var i = 0, trunks = new Array();
	while (text != 0) {
		var next = first_trunk(text, min_len, max_len);
		var trunk = text.substr(0, next);
		text = text.substr(next);
		trunks[i++] = trunk;
	}
	return trunks;
}

function print_trunks(trunks)
{
	for (var i = 0; i < trunks.length; i++) {
		console.log('trunk[' + i + ']: ' + trunks[i]);
	};
}
