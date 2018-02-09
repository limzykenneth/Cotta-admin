<template>
	<article>
		<form v-on:submit.prevent="submitSchema">
			<schemas-edit-field
				v-for="(field, index) in fields" :key="index"

				:fieldName="field.name"
				:fieldType="field.type"
				:selfIndex="index"

				v-on:removeField="removeField"
			></schemas-edit-field>

			<button v-on:click.prevent="addField">Add</button>

			<input type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
import SchemasEditField from "./ContentSchemasEditField.vue";

export default{
	name: "SchemasEdit",
	components: {
		"schemas-edit-field": SchemasEditField
	},
	props: {
		"currentCollectionSchema": {
			type: Object
		}
	},
	data: function(){
		var fields = [];
		if(this.currentCollectionSchema){
			fields = this.currentCollectionSchema.fields.slice(0);
		}else{
			fields = [{
				properties: {},
				name: "",
				slug: "",
				type: ""
			}];
		}
		return {
			fields
		};
	},
	methods: {
		submitSchema: function(){

		},
		addField: function(){
			var newField = {
				properties: {},
				name: "",
				slug: "",
				type: ""
			};
			this.fields.push(newField);
		},
		removeField: function(index){
			this.fields.splice(index, 1);
		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>