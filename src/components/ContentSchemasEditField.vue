<template>
	<div>
		<input type="text" name="field" v-on:input="nameChanged" :value="fieldName">
		<select v-on:input="selectionChanged" :value="value">
			<option disabled selected value> -- select an option -- </option>
			<option value="wysiwyg">wysiwyg</option>
			<option value="text">text</option>
			<option value="email">email</option>
			<option value="checkbox">checkbox</option>
			<option value="radio">radio</option>
			<option value="file">file</option>
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
		selectionChanged: function(e){
			this.$emit("input", e.target.value);
		},
		nameChanged: function(e){
			this.$emit("nameChanged", e.target.value, this.selfIndex);
		}
	}
};
</script>

<style lang="less">
@import "../mixins.less";
</style>