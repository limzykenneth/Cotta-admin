<template>
	<article id="settings-container">
		<h1>Settings</h1>

		<form v-for="(config, key) in configurations" :key="key"
			class="config-field"
			v-on:submit.prevent="submitConfig"
		>
			<span class="labels">
				<label :for="config.config_name">{{ config.config_name }}</label>
			</span>
			<span class="inputs">
				<input type="text"
					:name="config.config_name"
					:value="config.config_value"
				>
			</span>
			<input class="submit" type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
export default {
	name: "SettingsPage",
	props: {
		"configurations": {
			type: Array,
			required: true
		}
	},
	methods: {
		submitConfig: function(e){
			// NOTE: may need config schema in order to parse correctly
			const data = new FormData(e.target);
			const result = {};

			for(const entry of data){
				result.config_name = entry[0];
				if(entry[0] === "upload_file_accepted_MIME"){
					result.config_value = entry[1].split(",");
				}else{
					result.config_value = entry[1];
				}
			}

			this.$emit("submitConfig", result);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

#settings-container{
	.config-field{
		margin-bottom: 1rem;
		display: flex;
		flex-direction: row;
		min-height: 1.5rem;

		.labels{
			min-width: 300px;
		}

		.inputs{
			margin: 0 1rem;
		}

		.submit{

		}
	}
}
</style>