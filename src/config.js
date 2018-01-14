function config_default() {
	return {
	'modifyDate': 'Sun Jan 14 15:50:32 EST 2018',
	'apiChoice': 0,
	'popup_playing': false,
	'shortcut_keys': 'Ctrl+Q',
	'user_id': 'Unknown',
	'prompt_license': true,
	'apiList':
	[
		{
			'name': 'Amazon Polly',
			'description': 'Currently English only',
			'website': 'https://aws.amazon.com/polly/',
			'url': 'https://support.lsdsoftware.com/read-aloud/speak/en/{voice}',
			'txt_uri_key': 'q',
			'voice_gap': 0,
			'disabled': false,
			'options': [
				{
					'name': 'Voice',
					'uri_key': '{voice}',
					'choice': 'Amazon US English (Kendra)',
					'uri_val': [
						['Ivy', 'Amazon US English (Ivy)'],
						['Joey', 'Amazon US English (Joey)'],
						['Justin', 'Amazon US English (Justin)'],
						['Kendra', 'Amazon US English (Kendra)'],
						['Kimberly', 'Amazon US English (Kimberly)'],
						['Salli', 'Amazon US English (Salli)']
						//['Matthew', 'Amazon US English (Matthew)']
					]
				},
			]
		},
		{
			'name': 'IBM Watson',
			'description': 'Human-sounding voice',
			'website': 'http://www.ibm.com/watson/developercloud/text-to-speech.html',
			'url': 'https://text-to-speech-demo.ng.bluemix.net/api/synthesize',
			'txt_uri_key': 'text',
			'voice_gap': 0,
			'disabled': false,
			'options': [
				{
					'name': 'Speed',
					'SSML': true,
					'uri_key': 'rate',
					'choice': '0%',
					'uri_val': [
						['Bolt', '100%'],
						['Very fast', '80%'],
						['Fast', '50%'],
						['Normal', '0%'],
						['Slow', '-50%'],
						['Very slow', '-80%'],
						['Lazy', '-100%']
					]
				},
				{
					'name': '_',
					'SSML': true,
					'uri_key': 'type',
					'choice': 'Custom',
					'uri_val': []
				},
				// {
				// 	'name': 'Pitch',
				// 	'SSML': true,
				// 	'uri_key': 'pitch',
				// 	'choice': '0%',
				// 	'uri_val': [
				// 		['100', '100%'],
				// 		['50', '50%'],
				// 		['0', '0%'],
				// 		['-50', '-50%'],
				// 		['-100', '-100%']
				// 	]
				// },
				{
					'name': 'Pitch range',
					'SSML': true,
					'uri_key': 'pitch_range',
					'choice': '0%',
					'uri_val': [
						['100', '100%'],
						['50', '50%'],
						['0', '0%'],
						['-50', '-50%'],
						['-100', '-100%']
					]
				},
				{
					'name': 'Voice',
					'uri_key': 'voice',
					'choice': 'en-US_AllisonVoice',
					'uri_val': [
						['Michael (US)', 'en-US_MichaelVoice'],
						['Lisa (US)', 'en-US_LisaVoice'],
						['Kate (EN)', 'en-GB_KateVoice'],
						['Renee (FR)', 'fr-FR_ReneeVoice'],
						['Birgit (DE)', 'de-DE_BirgitVoice'],
						['Dieter (DE)', 'de-DE_DieterVoice'],
						['Francesca (IT)', 'it-IT_FrancescaVoice'],
						['Emi (JP)', 'ja-JP_EmiVoice'],
						['Isabela (PT)', 'pt-BR_IsabelaVoice'],
						['Enrique (ES)', 'es-ES_EnriqueVoice'],
						['Sofia (ES)', 'es-US_SofiaVoice'],
						['Allison (US)', 'en-US_AllisonVoice']
					]
				}
			]
		},
		{
			'name': 'Responsive Voice',
			'description': 'Multi-language',
			'website': 'https://responsivevoice.com',
			'url': 'https://code.responsivevoice.org/getvoice.php',
			'txt_uri_key': 't',
			'voice_gap': 0,
			'disabled': false,
			'options': [
				{
					'name': 'Speech speed',
					'uri_key': 'rate',
					'choice': '0.5',
					'uri_val': [
						['Very slow', '0.2'],
						['Slow', '0.3'],
						['Normal', '0.5'],
						['Fast', '0.7'],
						['Very Fast', '0.8'],
						['Bolt', '1.0']
					]
				},
				{
					'name': 'Volume',
					'uri_key': 'vol',
					'choice': '1.0',
					'uri_val': [
						['1.0', '1.0'],
						['0.8', '0.8'],
						['0.6', '0.6'],
						['0.4', '0.4'],
						['0.2', '0.2']
					]
				},
				{
					'name': 'Language',
					'uri_key': 'tl',
					'choice': 'en_US',
					'uri_val': [
						['English United States', 'en_US'],
						['English United Kingdom', 'en_GB'],
						['English India', 'en_IN'],
						['German Germany', 'de_DE'],
						['Spanish Spain', 'es_ES'],
						['Spanish Mexico', 'es_MX'],
						['Spanish United States', 'es_US'],
						['French Belgium', 'fr_BE'],
						['French France', 'fr_FR'],
						['Indonesian Indonesia', 'in_ID'],
						['Italian Italy', 'it_IT'],
						['Hindi India', 'hi_IN'],
						['Japanese Japan', 'ja_JP'],
						['Korean South Korea', 'ko_KR'],
						['Dutch Netherlands', 'nl_NL'],
						['Polish Poland', 'pl_PL'],
						['Portuguese Brazil', 'pt_BR'],
						['Portuguese Portugal', 'pt_PT'],
						['Russian Russia', 'ru_RU'],
						['Thai Thailand', 'th_TH'],
						['Turkish Turkey', 'tr_TR'],
						['Chinese China', 'zh_CN'],
						['Chinese Hong Kong', 'zh_HK'],
						['Chinese Taiwan', 'zh_TW']
					]
				},
				{
					'name': 'Pitch',
					'uri_key': 'pitch',
					'choice': '0.5',
					'uri_val': [
						['0.1', '0.1'],
						['0.3', '0.3'],
						['0.5', '0.5'],
						['0.7', '0.7'],
						['0.9', '0.9']
					]
				}
			]
		},
		{
			'name': 'Baidu Deep Voice',
			'website': 'http://yuyin.baidu.com/#try',
			'description': 'Best for Chinese',
			//'url': 'https://ai.baidu.com/aidemo',
			'url': 'http://tsn.baidu.com/text2audio',
			'txt_uri_key': 'tex',
			'voice_gap': 0,
			'disabled': false,
			'options': [
				{
					'name': '_',
					'uri_key': 'type',
					'choice': 'tns',
					'uri_val': []
				},
				{
					'name': '_',
					'uri_key': 'idx',
					'choice': '1',
					'uri_val': []
				},
				{
					'name': '_',
					'uri_key': 'cuid',
					'choice': 'baidu_speech_demo',
					'uri_val': []
				},
				{
					'name': '_',
					'uri_key': 'cod',
					'choice': '2',
					'uri_val': []
				},
				{
					'name': '_',
					'uri_key': 'lan',
					'choice': 'zh',
					'uri_val': []
				},
				{
					'name': '_',
					'uri_key': 'ctp',
					'choice': '1',
					'uri_val': []
				},
				{
					'name': '_',
					'uri_key': 'pdt',
					'choice': '1',
					'uri_val': []
				},
				{
					'name': 'Voice',
					'uri_key': 'per',
					'choice': '1',
					'uri_val': [
						['Woman', '0'],
						['Man', '1']
					]
				},
				{
					'name': 'Volume',
					'uri_key': 'vol',
					'choice': '5',
					'uri_val': [
						['2', '2'],
						['3', '3'],
						['5', '5'],
						['7', '7'],
						['9', '9'],
						['11', '11'],
						['13', '13'],
						['15', '15']
					]
				},
				{
					'name': 'Pitch',
					'uri_key': 'pit',
					'choice': '5',
					'uri_val': [
						['0', '0'],
						['1', '1'],
						['3', '3'],
						['5', '5'],
						['7', '7'],
						['8', '8'],
						['9', '9']
					]
				},
				{
					'name': 'Speed',
					'uri_key': 'spd',
					'choice': '5',
					'uri_val': [
						['0', '0'],
						['1', '1'],
						['3', '3'],
						['5', '5'],
						['7', '7'],
						['8', '8'],
						['9', '9']
					]
				}
			]
		},
		{
			'name': 'Voice RSS',
			'description': 'Old & stable service',
			'website': 'http://www.voicerss.org/api/',
			'url': 'http://www.voicerss.org/controls/speech.ashx',
			'txt_uri_key': 'src',
			'voice_gap': 0.55,
			'disabled': false,
			'options': [
				{
					'name': 'Language',
					'uri_key': 'hl',
					'choice': 'en-us',
					'uri_val': [
						["English (UnitedStates)", "en-us"],
						["English (Canada)", "en-ca"],
						["English (GreatBritain)", "en-gb"],
						["English (India)", "en-in"],
						["English (Australia)", "en-au"],
						["French (Canada)", "fr-ca"],
						["French (France)", "fr-fr"],
						["Chinese (China)", "zh-cn"],
						["Chinese (HongKong)", "zh-hk"],
						["Chinese (Taiwan)", "zh-tw"],
						["Danish ", "da-dk"],
						["Dutch ", "nl-nl"],
						["Finnish ", "fi-fi"],
						["Russian ", "ru-ru"],
						["German ", "de-de"],
						["Italian ", "it-it"],
						["Japanese ", "ja-jp"],
						["Korean ", "ko-kr"],
						["Norwegian ", "nb-no"],
						["Polish ", "pl-pl"],
						["Portuguese (Brazil)", "pt-br"],
						["Portuguese (Portugal)", "pt-pt"],
						["Spanish (Mexico)", "es-mx"],
						["Spanish (Spain)", "es-es"],
						["Swedish (Sweden)", "sv-se"],
						["Catalan ", "ca-es"]
					]
				},
				{
					'name': 'Speech speed',
					'uri_key': 'r',
					'choice': 0,
					'uri_val': [
						['Slow', -10],
						['Normal', 0],
						['Fast', 10]
					]
				}
			]
		}
	],
	"test_text": "Speech synthesis is the artificial production of human speech. A computer system used for this purpose is called a speech computer or speech synthesizer, and can be implemented in software or hardware products. A text-to-speech (TTS) system converts normal language text into speech; other systems render symbolic linguistic representations like phonetic transcriptions into speech."
	};
}

function config_write(config) {
	chrome.storage.local.set(config);
}

function config_read(ret_callbk) {
	chrome.storage.local.get(null, function (current_cfg) {
		var default_cfg = config_default();
		if (current_cfg.modifyDate != default_cfg.modifyDate) {
			console.log('config schema changed, set to default values.');
			config_write(default_cfg);
			current_cfg = default_cfg;
		}
		ret_callbk(current_cfg);
	});
}
