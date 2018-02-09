<template>
	<div>
		<input type="text" name="field_1" :value="fieldName">
		<select>
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
		"fieldType": {
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
			return fieldValue == this.fieldType;
		},
		removeField: function(index){
			this.$emit("removeField", index);
		}
	}
}
</script>

<style lang="less">
@import "../mixins.less";
</style>