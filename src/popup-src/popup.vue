<template>

<form>
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

	<button class="btn btn-warning" @click="test()">Test configuration</button>
	<button class="btn btn-default" @click="reset()">Reset to default</button>

	<div>
	<pre>Chosen API: {{ apiChoice }}</pre>
	<span class="stop" v-if="popup_playing">
		<i class="fa fa-stop-circle" aria-hidden="true"></i>
		<a @click="stop">Stop</a> current speech
	</span>
	<span class="ps">About the
	<a target="_blank" href="https://approach0.xyz/tkblog/about.html">author</a></span>
	</div>
</div>
</form>

</template>

<script>
var bkgd = chrome.extension.getBackgroundPage();

setInterval(function() {
	bkgd.g_api_settings.popup_playing = (bkgd.g_playing_idx >= 0);
}, 600);

module.exports = {
	data: function () {
		return bkgd.g_api_settings;
	},
	created: function () {
		console.log('popup.vue created.')
	},
	watch: {
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
		}
	}
};

</script>

<style>
pre {
/**/
	display: none;
}
span.ps {
	font-size: 9px;
	float: right;
	margin-top: 14px;
}
span.stop {
	margin-top: 10px;
	font-size: 12px;
	float: left;
}
span a:hover {
	cursor: pointer;
}
</style>
