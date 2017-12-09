//var url = 'https://text-to-speech-demo.ng.bluemix.net/api/synthesize?text=hello%20world&voice=en-US_AllisonVoice';

function config_default() {
	return {
	'modifyDate': 'Sat Dec  9 04:25:02 EST 2017',
	'apiChoice': 0,
	'apiList':
	[
		{
			'name': 'IBM Watson',
			'url': 'http://www.ibm.com/watson/developercloud/text-to-speech.html',
			'options': [
				{
					'name': 'Voice',
					'uri_key': 'vo',
					'choice': 'alice',
					'uri_val': [
						['Alice', 'alice'],
						['Bob', 'bob']
					]
				},
				{
					'name': 'Language',
					'uri_key': 'hl',
					'choice': 'en-us',
					'uri_val': [
						['English', 'en-us'],
						['Chinese', 'zh-cn']
					]
				},
				{
					'name': 'Speech speed',
					'uri_key': 'r',
					'choice': 0,
					'uri_val': [
						['very slow', -10],
						['slow', -5],
						['normal', 0],
						['fast', 5],
						['very fast', 10]
					]
				}
			]
		},
		{
			'name': 'Voice RSS',
			'url': 'http://www.voicerss.org/api/',
			'options': [
				{
					'name': 'Language',
					'uri_key': 'hl',
					'choice': 'en-us',
					'uri_val': [
						['English', 'en-us'],
						['Chinese', 'zh-cn']
					]
				},
				{
					'name': 'Speech speed',
					'uri_key': 'r',
					'choice': 0,
					'uri_val': [
						['very slow', -10],
						['slow', -5],
						['normal', 0],
						['fast', 5],
						['very fast', 10]
					]
				}
			]
		}
	]};
}

function config_write(config) {
	chrome.storage.local.set(config);
}

function config_read(ret_callbk) {
	chrome.storage.local.get(null, function (current_cfg) {
		default_cfg = config_default();
		if (current_cfg.modifyDate != default_cfg.modifyDate) {
			console.log('config schema changed, set to default values.');
			config_write(default_cfg);
			current_cfg = default_cfg;
		}
		ret_callbk(current_cfg);
	});
}
