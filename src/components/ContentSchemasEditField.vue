<template>
	<div>
		<input type="text" name="field" :value="fieldName">
		<select v-on:input="selectionChanged" :value="value">
			<option disabled selected value> -- select an option -- </option>
			<option value="wysiwyg" :selected="isSelected('wysiwyg')">wysiwyg</option>
			<option value="text" :selected="isSelected('text')">text</option>
			<option value="email" :selected="isSelected('email')">email</option>
			<option value="checkbox" :selected="isSelected('checkbox')">checkbox</option>
			<option value="radio" :selected="isSelected('radio')">radio</option>
		</select>

		<button v-on:click.prevent="removeField(selfIndex)">Remove</button>
	</div>
</template>

<script>
export default {
	name: "SchemasEditField",
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
		}
	},
	methods: {
		isSelected: function(fieldValue){
			return fieldValue == this.value;
		},
		removeField: function(index){
			this.$emit("removeField", index);
		},
		selectionChanged: function(value){
			this.$emit("input");
		}
	}
}
</script>

<style lang="less">
@import "../mixins.less";
</style>