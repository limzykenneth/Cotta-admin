<template>
	<article>
		<form v-on:submit.prevent="submitSchema">
			<label for="collectionName">Collection Name: </label>
			<input id="collectionName" type="text" name="collectionName" :disabled="editName"
				v-model="collectionName"
			>

			<schemas-edit-field
				v-for="(field, index) in fields" :key="index"

				:fieldName="field.name"
				:selfIndex="index"
				v-model="field.type"

				v-on:nameChanged="nameChanged"
				v-on:removeField="removeField"
			></schemas-edit-field>

			<button v-on:click.prevent="addField">Add</button>

			<input type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
import snakeCase from "snake-case";
import SchemasEditField from "./ContentSchemasEditField.vue";

export default{
	name: "SchemasEdit",
	components: {
		"schemas-edit-field": SchemasEditField
	},
	props: {
		"currentCollectionSchema": {
			type: Object,
			default: function(){
				return {};
			}
		}
	},
	data: function(){
		var fields = [];
		var collectionName = "";

		if(this.currentCollectionSchema){
			fields = this.currentCollectionSchema.fields.slice(0);
			collectionName = this.currentCollectionSchema.collectionName;
		}else{
			fields = [{
				properties: {},
				name: "",
				slug: "",
				type: ""
			}];
		}

		return {
			collectionName,
			fields
		};
	},
	computed: {
		collectionSlug: function(){
			return snakeCase(this.collectionName);
		},
		editName: function(){
			if(typeof this.currentCollectionSchema == "undefined"){
				return false;
			}else{
				return true;
			}
		}
	},
	methods: {
		nameChanged: function(newName, i){
			this.fields[i].name = newName;
			this.fields[i].slug = snakeCase(newName);
		},
		submitSchema: function(){
			var schema = {
				collectionName: this.collectionName,
				collectionSlug: this.collectionSlug,
				fields: this.fields
			};
			// Handles new schemas only, edit not yet implemented in server
			this.$emit("submitSchema", schema);
		},
		validateInput: function(collectionName, fields){
			if(!collectionName){
				return false;
			}
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
};
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>