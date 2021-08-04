<template>
	<article id="settings-container">
		<h1>Settings</h1>

		<form v-for="(config, key) in configurations" :key="key"
			class="config-field"
			v-on:submit.prevent="submitConfig($event, key)"
		>
			<span class="labels">
				<label :for="config.config_name">{{ key | startCase }}</label>
			</span>
			<span class="inputs">
				<input type="text"
					:name="key"
					v-model="configurations[key]"
				>
			</span>
			<input class="submit" type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
import {
	startCase,
	isString,
	isBoolean,
	reduce,
	find
} from "lodash";

export default {
	name: "SettingsPage",
	filters: {
		startCase: function(val){
			return startCase(val);
		}
	},
	data: function(){
		return {
			configurations: reduce(this.$store.state.configurations, (acc, configuration) => {
				acc[configuration.config_name] = configuration.config_value;

				return acc;
			}, {})
		};
	},
	methods: {
		submitConfig: function(e, key){
			const result = {
				config_name: key,
				config_value: this.configurations[key]
			};
			const config_type = find(this.$store.state.configurations, (config) => {
				return config.config_name === key;
			}).config_type;

			switch(config_type){
				case "array":
					if(isString(result.config_value)){
						result.config_value = result.config_value
							.split(",")
							.map((val) => val.trim());
					}
					break;

				case "boolean":
					if(isBoolean(JSON.parse(result.config_value))){
						result.config_value = JSON.parse(result.config_value);
					}
					break;

				case "number":
					if(!Number.isNaN(parseFloat(result.config_value))){
						result.config_value = parseFloat(result.config_value);
					}
					break;

				case "string":
				default:
					break;
			}

			this.$store.dispatch("submitConfigurations", result).then((res) => {
				this.$store.commit("setToastMessage", `Config "${res.config_name}" changed.`);
			});
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