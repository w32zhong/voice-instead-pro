function config_default() {
	return {
	'setting':
	[
		{'API': 0},
		{'Language': 'English'},
		{'Speech speed': 'normal'},
		{'Volume': 'normal'},
		{'Voice': 'default'}
	],
	'readonly':
	[
		{
			'name': 'Voice RSS',
			'url': 'http://www.voicerss.org/api/',
			'args': {
				'Language': {
					'argnm': 'hl', 'opts': {
						'English': 'en-us',
						'Chinese': 'zh-cn'
					}
				},
				'Speech speed': {
					'argnm': 'r', 'opts': {
						'very slow': -10,
						'slow': -5,
						'normal': 0,
						'fast': 5,
						'very fast': 10
					}
				}
			}
		}
	]};
}

// var cfg = config_default();
// console.log(cfg);

//var url = 'https://text-to-speech-demo.ng.bluemix.net/api/synthesize?text=hello%20world&voice=en-US_AllisonVoice';
