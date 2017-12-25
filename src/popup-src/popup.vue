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
<div class="form-group">
	<div class="radio" v-for="(api, idx) in apiList">
		<label>
		<input type="radio" :value="idx" v-model="apiChoice" @change="save()">
		{{ api.name }}
		({{ api.description }} <a target="_blank" :href="api.website">
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
	<button class="btn btn-warning tst" v-if="!popup_playing" @click="test()">
		Test voice
	</button>
	<button class="btn btn-warning tst" v-if="popup_playing" @click="stop()">
		Stop speech
	</button>
	<button class="btn btn-default rst" @click="reset()">Reset</button>
</div>

</form>

</template>

<script>
var bkgd = chrome.extension.getBackgroundPage();

setInterval(function() {
	bkgd.g_api_settings.popup_playing = (bkgd.g_playing_idx >= 0);
	bkgd.getShortcut();
}, 600);

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
</style>
