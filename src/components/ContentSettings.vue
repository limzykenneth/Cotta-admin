<template>
	<article id="settings-container">
		<h1>Settings</h1>

		<form v-for="(config, key) in configurations" :key="key"
			class="config-field"
			v-on:submit.prevent="submitConfig"
		>
			<span class="labels">
				<label :for="config.config_name">{{ startCase(config.config_name) }}</label>
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
import startCase from "lodash.startcase";

export default {
	name: "SettingsPage",
	props: {
		"configurations": {
			type: Array,
			required: true
		}
	},
	methods: {
		startCase: function(str){
			return startCase(str);
		},
		submitConfig: function(e){
			const data = new FormData(e.target);
			const result = {};

			for(const entry of data){
				result.config_name = entry[0];

				const configType = _.find(this.configurations, (c) => {
					return c.config_name === result.config_name;
				}).config_type;

				switch(configType){
					case "string":
						result.config_value = entry[1];
						break;

					case "array":
						result.config_value = entry[1].split(",");
						break;

					case "boolean":
						if(_.isBoolean(JSON.parse(entry[1]))){
							result.config_value = JSON.parse(entry[1]);
						}
						break;

					case "number":
						if(!_.isNaN(parseFloat(entry[1]))){
							result.config_value = parseFloat(entry[1]);
						}
						break;

					default:
						break;
				}
			}

			this.$emit("submitConfig", result);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

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