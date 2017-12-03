var a = addAudioElement();

function addAudioElement(audioSrc) {
	var audioElement = document.createElement('audio');
	//audioElement.setAttribute("controls", "");
	//audioElement.setAttribute("autoplay", "");
	//audioElement.setAttribute("loop", "");
	//audioElement.setAttribute("muted", "");
	audioElement.setAttribute("preload", "auto");
	audioElement.src= '';
	// document.body.appendChild(audioElement);

	return audioElement;
}

chrome.runtime.onMessage.addListener(
  function(arg, sender, sendResponse) {
//	  audioElement.load;
//	  audioElement.play();
  }
);

callback = function(details) {
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
chrome.webRequest.onBeforeSendHeaders.addListener(callback, filter, opts);
