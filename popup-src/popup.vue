<template>

<form>
<h3>Choose TTS API</h3>
<div class="form-group">
	<div class="radio" v-for="(api, idx) in apiList">
		<label>
		<input type="radio" :value="idx" v-model="apiChoice" @change="save()">
		{{ api.name }} (<a target="_blank" :href="api.url">link</a>)
		</label>
	</div>

	<div class="form-group" v-for="option in apiList[apiChoice].options">
		<label> {{ option.name }}</label>
		<select class="form-control" v-model="option.choice" @change="save()">
			<option v-for="val in option.uri_val" :value="val[1]">
				{{ val[0] }}
			</option>
		</select>
	</div>

	<button class="btn btn-warning">Test speech</button>
	<button class="btn btn-default">Reset to default</button>

	<pre>
	Chosen API: {{ apiChoice }}
	</pre>
</div>
</form>

</template>

<script>
var bkgd = chrome.extension.getBackgroundPage();

module.exports = {
	data: function () {
		return bkgd.g_api_settings;
	},
	created: function () {
		console.log('popup.vue created.')
	},
	methods: {
		save: function () {
			console.log('config changed.');
			newData = module.exports.data();
			config_write(newData);
			bkgd.g_api_settings = newData;
		}
	}
};

</script>

<style>
pre {
/**/
display: none;
}
</style>
