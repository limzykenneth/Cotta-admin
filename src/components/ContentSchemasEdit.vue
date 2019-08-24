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
					v-for="(field, index) in fields" :key="index"

					:fieldName="field.name"
					:selfIndex="index"
					:choices="field.properties.choices"
					v-model="field.type"

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
		let fields = [];
		let tableName = "";

		if(this.currentCollectionSchema){
			fields = this.currentCollectionSchema.fields.slice(0);
			tableName = this.currentCollectionSchema.tableName;
		}else{
			fields = [{
				properties: {},
				name: "",
				slug: "",
				type: ""
			}];
		}

		return {
			tableName,
			fields
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
		nameChanged: function(newName, i){
			this.fields[i].name = newName;
			this.fields[i].slug = snakeCase(newName);
		},
		submitSchema: function(){
			const schema = {
				tableSlug: this.tableSlug,
				tableName: this.tableName,
				fields: this.fields
			};

			this.$emit("submitSchema", schema);
		},
		validateInput: function(tableName, fields){
			if(!tableName){
				return false;
			}
		},
		addField: function(){
			const newField = {
				properties: {},
				name: "",
				slug: "",
				type: ""
			};
			this.fields.push(newField);
		},
		removeField: function(index){
			this.fields.splice(index, 1);
		},
		choiceChanged: function(data){
			this.$set(this.fields[data.index].properties, "choices", data.choices);
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