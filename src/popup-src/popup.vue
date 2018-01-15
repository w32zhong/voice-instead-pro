<template>

<form>
<h4>Configure Shortcut Key</h4>
<div class="form-group">
	<p>Current shortcut key for reading selected text is
		<span><a target="_blank" @click="openShortkeySettings()">
		{{ shortcut_keys == '' ? 'not set' : shortcut_keys }}</a>.
		</span>
	</p>
</div>

<h4>Select Text-to-Speech API</h4>
<p class="prompt_license" v-if="prompt_license">
	Free version restricts freely choosing API
	(<a target="_blank" v-on:click.prevent="learn_why()">learn why</a>),
	<span v-if="user_id == 'Unknown'">
		please <a target="_blank" v-on:click.prevent="sign()">sign in.</a>
	</span>
	<span v-else>
		you can support VI and unlimit your choice by
		<a target="_blank" v-on:click.prevent="upgrade()">upgrading.</a>
	</span>
</p>
<div class="form-group">
	<div class="radio" v-for="(api, idx) in apiList">
		<label>
		<input type="radio" :value="idx" v-model="apiChoice" @change="save()"
		:disabled="api.disabled">
		{{ api.name }}
		({{ api.description }}
		<a target="_blank" :href="api.website">
			<i class="fa fa-external-link" aria-hidden="true"></i>
		</a>)
		</label>
	</div>
</div>

<div class="form-group">
	<div class="form-group" v-for="option in apiList[apiChoice].options">
		<div v-if="option.uri_val.length > 0">
		<label> {{ option.name }}</label>
		<select class="form-control" v-model="option.choice" @change="save()">
			<option v-for="val in option.uri_val" :value="val[1]">
				{{ val[0] }}
			</option>
		</select>
		</div>
	</div>
</div>

<div class="form-group text-center extra-top">
	<button class="btn btn-warning tst" v-if="popup_playing != 2" @click="test()">
		{{popup_playing == 0 ? "Test voice" : "Loading ..."}}
	</button>
	<button class="btn btn-warning tst" v-if="popup_playing == 2" @click="stop()">
		Stop speech
	</button>
	<button class="btn btn-default rst" @click="reset()">Reset</button>
</div>
</form>
</template>

<script>
var bkgd = chrome.extension.getBackgroundPage();

console.log('Settings:');
console.log(bkgd.g_api_settings);

setInterval(function() {
	if (bkgd.g_playing_idx >= 0) {
		bkgd.g_api_settings.popup_playing = 2; /* playing */
	} else if (bkgd.g_loading) {
		bkgd.g_api_settings.popup_playing = 1; /* loading */
	} else {
		bkgd.g_api_settings.popup_playing = 0; /* ready */
	}

	bkgd.getShortcut();
	
	if (bkgd.g_license_valid)
		bkgd.g_api_settings.prompt_license = false; /* full version */
	else
		bkgd.g_api_settings.prompt_license = true; /* free trial */
}, 600);

(function disableSomeOptions() {
	var list = bkgd.g_api_settings.apiList;
	var l = list.length;
	var curEpoch = Math.round((new Date()).getTime() / (60 * 1000));
	var randSeed1 = (curEpoch * curEpoch) % 100;
	var randSeed2 = (curEpoch * curEpoch) % (l - 1);
	var idx1 = randSeed1 % l;
	var idx2 = (idx1 + 1 + randSeed2) % l;

	if (!bkgd.g_license_valid) {
		/* disable all options first if not paid */
		for (var i = 0; i < l; i++)
			list[i].disabled = true;

		console.log('curEpoch: ' + curEpoch);
		console.log('enable option ' + idx1 + ', ' + idx2);

		/* set choice to idx1 if it is not yet enabled */
		var choice = bkgd.g_api_settings.apiChoice;
		if (choice != idx1 && choice != idx2) {
			bkgd.g_api_settings.apiChoice = idx1;
		}

		/* only allow random two options */
		list[idx1].disabled = false;
		list[idx2].disabled = false;
	} else {
		for (var i = 0; i < l; i++)
			list[i].disabled = false;

		console.log('Valid license, I feel thankful.');
	}
}());

module.exports = {
	data: function () {
		return bkgd.g_api_settings;
	},
	created: function () {
		console.log('popup.vue created.')
	},
	watch: {
		'shortcut_keys': function (newVal, oldVal) {
			console.log('shortcut_keys changed to ' + newVal);
		},
		'user_id': function (newVal, oldVal) {
			console.log('user_id changed to ' + newVal);
		},
		'popup_playing': function (newVal, oldVal) {
			console.log('popup_playing changed to ' + newVal);
		}
	},
	methods: {
		save: function () {
			console.log('config changed.');
			var newCfg = module.exports.data();
			config_write(newCfg);
			bkgd.g_api_settings = newCfg;
		},
		test: function () {
			var testTxt = module.exports.data().test_text;
			bkgd.speech_stop();
			bkgd.text2speech(testTxt);
		},
		stop: function () {
			bkgd.speech_stop();
			bkgd.sendMsgToTab({"event": "ended", "args": {}});
		},
		reset: function () {
			var default_cfg = config_default();
			config_write(default_cfg);
			bkgd.g_api_settings = default_cfg;
			this.stop();
		},
		sign: function () {
			/* debug */
			//bkgd.g_api_settings.user_id = 'tester';

			/* production */
			bkgd.authenticate_client();
		},
		upgrade: function () {
			bkgd.authenticate_client();

			chrome.tabs.create({'url':
			"https://chrome.google.com/webstore/detail/voice-instead/kphdioekpiaekpmlkhpaicehepbkccbf/"});
		},
		learn_why: function () {
			chrome.tabs.create({'url': chrome.extension.getURL('learn_why.html')});
		},
		openShortkeySettings: function () {
			chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
		}
	}
};

</script>

<style>
a {
	cursor: pointer;
}
div.extra-top {
	padding-top: 11px;
}
button.tst {
	width: 60%;
}
button.rst {
	width: 38%;
}
button.btn {
	word-spacing: 3px;
}
p.prompt_license {
	font-size: 10px;
}
</style>
