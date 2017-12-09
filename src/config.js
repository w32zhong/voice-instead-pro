function config_default() {
	return {
	'modifyDate': 'Sat Dec  9 16:32:07 EST 2017',
	'apiChoice': 0,
	'popup_playing': false,
	'apiList':
	[
		{
			'name': 'IBM Watson',
			'website': 'http://www.ibm.com/watson/developercloud/text-to-speech.html',
			'url': 'https://text-to-speech-demo.ng.bluemix.net/api/synthesize',
			'txt_uri_key': 'text',
			'voice_gap': 0,
			'options': [
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
			'website': 'https://responsivevoice.com',
			'url': 'https://code.responsivevoice.org/getvoice.php',
			'txt_uri_key': 't',
			'voice_gap': 0,
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
						['Bolt Speech', '1.0']
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
			'name': 'Voice RSS',
			'website': 'http://www.voicerss.org/api/',
			'url': 'http://www.voicerss.org/controls/speech.ashx',
			'txt_uri_key': 'src',
			'voice_gap': 1.2,
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
