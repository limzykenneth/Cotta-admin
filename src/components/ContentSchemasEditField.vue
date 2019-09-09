<template>
	<div class="schema-field">
		<input type="text" name="field" required
			v-on:blur="nameChanged" :value="fieldName"
		>
		<select v-on:input="selectionChanged" :value="value" required>
			<option disabled selected value> -- select an option -- </option>
			<option value="wysiwyg">wysiwyg</option>
			<option value="text">text</option>
			<option value="email">email</option>
			<option value="checkbox">checkbox</option>
			<option value="radio">radio</option>
			<option value="file">file</option>
		</select>

		<button v-on:click.prevent="removeField(selfKey)">Remove</button>

		<div class="multi-choice-container" v-if="choicesArray.length">
			<multi-choice
				v-for="(choice, index) in choicesArray" :key="index"

				:choice="choice"
				:index="index"
				:showRemove="showRemove"

				v-on:removeChoice="removeChoice"
				v-on:choiceChanged="choiceChanged"
			>
			</multi-choice>
			<button v-on:click.prevent="addChoice">Add</button>
		</div>
	</div>
</template>

<script>
import MultiChoice from "./ContentSchemasEditFieldMultiChoice.vue";

export default {
	name: "SchemasEditField",
	components: {
		"multi-choice": MultiChoice
	},
	props: {
		"fieldName": {
			type: String,
			default: ""
		},
		"value": {
			type: String,
			default: ""
		},
		"selfIndex": {
			type: Number,
			required: true
		},
		"selfKey":{
			type: String,
			required: true
		},
		"choices": {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data: function(){
		// choices object to choicesArray
		const choicesArray = _.map(this.choices, (choice, key) => {
			return {
				label: key,
				value: choice
			};
		});

		return {
			"choicesArray": choicesArray
		};
	},
	computed: {
		showRemove: function(){
			return this.choicesArray.length > 1;
		}
	},
	methods: {
		removeField: function(index){
			this.$emit("removeField", index);
		},
		selectionChanged: function(e){
			if(e.target.value === "checkbox" || e.target.value === "radio"){
				this.choicesArray = [{
					label: "",
					value: ""
				}];
			}
			this.$emit("input", e.target.value);
			this.$emit("choiceChanged", {
				choices: null,
				key: this.selfKey
			});
		},
		nameChanged: function(e){
			this.$emit("nameChanged", e.target.value, this.selfKey);
		},
		addChoice: function(e){
			this.choicesArray.push({
				label: "",
				value: ""
			});
		},
		removeChoice: function(index){
			this.choicesArray.splice(index, 1);
		},
		choiceChanged: function(data){
			this.choicesArray[data.index] = data.choice;
			const choices = _.reduce(this.choicesArray, (acc, c, i) => {
				acc[c.label] = c.value;
				return acc;
			}, {});
			this.$emit("choiceChanged", {
				choices,
				key: this.selfKey
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

.schema-field{
	margin-bottom: 0.5rem;

	input{
		width: 300px;
	}

	select{
		width: 300px;
	}
}
</style>