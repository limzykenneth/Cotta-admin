<template>
	<article id="schema-edit-container">
		<form id="form" v-on:submit.prevent="submitSchema">
			<div id="collection-name">
				<label for="tableName">Collection Name: </label>
				<input type="text" name="tableName" required
					:disabled="editName"
					v-model="tableName"
				>
			</div>

			<div id="schema-fields-container">
				<div id="schema-fields-label">
					<span id="field-name-label">Field Name</span>
					<span id="field-type-label">Field Type</span>
				</div>

				<schemas-edit-field
					v-for="(field, key, index) in definition" :key="key"

					:fieldName="field.app_title"
					:selfIndex="index"
					:selfKey="key"
					:choices="field.app_values"
					v-model="field.app_type"

					v-on:nameChanged="nameChanged"
					v-on:removeField="removeField"
					v-on:choiceChanged="choiceChanged"
				></schemas-edit-field>
			</div>

			<button v-on:click.prevent="addField">Add</button>

			<input type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
import cloneDeep from "lodash/lang";
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
				return null;
			}
		}
	},
	data: function(){
		let definition = [];
		let tableName = "";

		if(this.currentCollectionSchema){
			definition = this.currentCollectionSchema.definition;
			tableName = this.currentCollectionSchema.tableName;
		}else{
			definition = {};
		}

		return {
			tableName,
			definition
		};
	},
	computed: {
		tableSlug: function(){
			return snakeCase(this.tableName);
		},
		editName: function(){
			if(this.currentCollectionSchema){
				return true;
			}else{
				return false;
			}
		}
	},
	methods: {
		nameChanged: function(newName, oldName){
			const name = newName.trim();

			if(newName !== oldName){
				const appSlug = snakeCase(name);
				this.$set(this.definition, appSlug,cloneDeep(this.definition[snakeCase(oldName)]));
				this.$set(this.definition[appSlug], "app_title", name);
				this.$delete(this.definition, oldName);
			}
		},
		submitSchema: function(){
			const schema = {
				tableSlug: this.tableSlug,
				tableName: this.tableName,
				definition: this.definition
			};

			for(const key in schema.definition){
				switch(schema.definition[key].app_type){
					case "wysiwyg":
					case "text":
					case "email":
					case "radio":
						schema.definition[key].type = "string";
						break;

					case "checkbox":
						schema.definition[key].type = "array";
						break;

					case "file":
						schema.definition[key].type = ["object", "array"];
						break;

					default:
						console.log("Not implemented yet");
						return false;
				}
			}
			this.$emit("submitSchema", schema);
		},
		validateInput: function(tableName, definition){
			if(!tableName){
				return false;
			}
		},
		// NOTE: How to do this with an object? We need multiple with same name ("")
		// Maybe an extra "order" field would be needed
		// Currently can only add one empty field at a time, and fields can't have same name
		addField: function(){
			const newField = {
				app_title: "",
				app_type: ""
			};
			this.$set(this.definition, "", newField);
		},
		removeField: function(key){
			this.$delete(this.definition, key);
		},
		choiceChanged: function(data){
			if(data.choices){
				this.$set(this.definition[data.key], "app_values", data.choices);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

#schema-edit-container{
	#form{
		#collection-name{
			margin-bottom: 1rem;

			&>label{
				display: inline-block;
				min-width: 170px;
				font-weight: bold;
			}
			&>input{
				display: inline-block;
				width: 500px;
			}
		}

		#schema-fields-container{
			margin-bottom: 1rem;
			display: flex;
			flex-direction: column;

			#schema-fields-label{
				font-weight: bold;

				#field-name-label{
					display: inline-block;
					width: 300px;
					text-align: center;
				}
				#field-type-label{
					display: inline-block;
					width: 300px;
					text-align: center;
				}
			}
		}
	}
}
</style>