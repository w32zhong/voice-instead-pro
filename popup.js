//var url = 'https://text-to-speech-demo.ng.bluemix.net/api/synthesize?text=hello%20world&voice=en-US_AllisonVoice';

var url = 'http://www.voicerss.org/controls/speech.ashx?hl=en-us&src=hello%20world';

// var a = chrome.extension.getBackgroundPage().a;
// a.src = 'http://lezotre.free.fr/Mp3/disco.mp3';
// a.play();

var audio = chrome.extension.getBackgroundPage().a;

setInterval(function(){
	var xhr = new XMLHttpRequest();

	xhr.addEventListener('load', function (blob) {
		// console.log('status: ' + xhr.status);
		if (xhr.status == 200) {
			audio.src = window.URL.createObjectURL(xhr.response);
			audio.play();
		}
	});

	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send(null);
}, 1000);
