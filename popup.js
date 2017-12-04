//var url = 'https://text-to-speech-demo.ng.bluemix.net/api/synthesize?text=hello%20world&voice=en-US_AllisonVoice';

// var a = chrome.extension.getBackgroundPage().a;
// a.src = 'http://lezotre.free.fr/Mp3/disco.mp3';
// a.play();

// var audio = chrome.extension.getBackgroundPage().a1;
//
// var msg = {"string": "sitting next next to me"};
// chrome.runtime.sendMessage(msg);

var audio_ctrl = document.getElementById("audio_ctrl");
audio_ctrl.innerHTML = audio_control_dom();
