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
					v-for="(field, index) in definition" :key="index"

					:fieldName="field.properties.app_title"
					:selfIndex="index"
					:selfKey="field.key"
					:choices="field.properties.app_values"
					v-model="field.properties.app_type"

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
import snakeCase from "lodash.snakecase";
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
			definition = this._objectToArray(this.currentCollectionSchema.definition);
			tableName = this.currentCollectionSchema.tableName;
		}else{
			definition = [];
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
		nameChanged: function(newName, index){
			const name = newName.trim();
			const nameSlug = snakeCase(name);

			const selected = this.definition[index];
			selected.key = nameSlug;
			selected.properties.app_title = name;
		},
		submitSchema: function(){
			try{
				const parsedDefinition = this._arrayToObject(this.definition);

				const schema = {
					tableSlug: this.tableSlug,
					tableName: this.tableName,
					definition: parsedDefinition
				};

				// Maybe move this so that it is reactive
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

				this.$store.dispatch("submitSchema", schema).then((type) => {
					this.$store.commit("setContentView", this.$store.state.contentViews.schemasList);
					if(type === "new"){
						this.$store.commit("setToastMessage", `Created schema "${schema.tableName}".`);
					}else if(type === "edit"){
						this.$store.commit("setToastMessage", `Edited schema "${schema.tableName}".`);
					}
				}).catch((err) => {
					this.$store.commit("setToastMessage", err.detail);
				});
			}catch(err){
				this.$store.commit("setToastMessage", err.message);
			}
		},
		validateInput: function(tableName, definition){
			if(!tableName){
				return false;
			}
		},
		addField: function(){
			this.definition.push({
				key: "",
				properties: {
					app_title: "",
					app_type: ""
				}
			});
		},
		removeField: function(index){
			this.$delete(this.definition, index);
		},
		choiceChanged: function(data){
			if(data.choices){
				this.definition[data.index].properties.app_values = data.choices;
			}
		},

		_objectToArray: function(obj){
			return _.map(obj, (prop, key) => {
				return {
					key,
					properties: prop
				};
			});
		},
		_arrayToObject: function(arr){
			return _.reduce(arr, (acc, val) => {
				if(acc[val.key]){
					throw new Error(`Duplicate field name: ${val.key}`);
				}
				acc[val.key] = val.properties;
				return acc;
			}, {});
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

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