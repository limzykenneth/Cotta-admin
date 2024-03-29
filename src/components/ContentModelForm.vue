<template>
	<form id="form" v-on:submit.prevent="submitModel">
		<div class="field-container"
			v-for="(field, key) in currentCollectionSchema.definition" :key="key"
		>
			<label class="field-name" :for="key">
				{{ field.app_title }}
			</label>

			<span class="field" v-if="field.app_type == 'checkbox' || field.app_type == 'radio'">
				<span class="v-for-container"
					v-for="(choice, label) in field.app_values" :key="label"
				>
					<input
						:id="choice"
						:type="field.app_type"
						:name="key"
						:value="choice"
						:checked="checkboxChecked(choice, key)"
					>
					<label :for="choice">{{ label }}</label>
				</span>
			</span>

			<span class="field" v-else-if="field.app_type == 'file'">
				<file-input
					:name="key"
					:files-metadata="currentModel[key]"
				/>
			</span>

			<span class="field" v-else-if="field.app_type == 'wysiwyg'">
				<wysiwyg-input
					:name="key"
					:content="currentModel[key]"
					v-on:wysiwygChanged="wysiwygChanged"
				/>
			</span>

			<span class="field" v-else>
				<input required
					:type="field.app_type"
					:name="key"
					:value="currentModel[key]"
				>
			</span>

		</div>

		<input id="submit" type="submit" name="submit" value="Submit">
	</form>
</template>

<script>
import {each} from "lodash";
import FileInput from "./ContentModelFormFile.vue";
import WYSIWYGInput from "./ContentModelFormQuill.vue";

export default{
	name: "ModelForm",
	components: {
		"file-input": FileInput,
		"wysiwyg-input": WYSIWYGInput
	},
	props: {
		"currentCollectionSchema": {
			type: Object,
			required: true
		},
		"currentModel": {
			type: Object,
			default: function(){
				return {};
			}
		}
	},
	data: function(){
		const wysiwygContents = {};
		each(this.currentCollectionSchema.definition, (el, key) => {
			if(el.app_type === "wysiwyg"){
				wysiwygContents[key] = this.currentModel[key] || "";
			}
		});

		return {
			wysiwygContents
		};
	},
	methods: {
		submitModel: function(e){
			const result = this.$_formToJSON(e.target);

			if(this.validateModel(result)){
				this.$store.dispatch("submitModel", {
					model: result,
					tableSlug: this.currentCollectionSchema.tableSlug,
					uid: this.currentModel._uid || "",
					schema: this.currentCollectionSchema
				}).then((model) => {
					this.$store.commit("setCurrentModel", {
						model,
						tableSlug: this.currentCollectionSchema.tableSlug
					});
					this.$store.commit("setContentView", this.$store.state.contentViews.modelPage);
					this.$store.commit("setToastMessage", "Created new model");
				}).catch((err) => {
					this.$store.commit("setToastMessage", err.message || err.detail);
				});
			}else{
				// Validation failed, show message
			}
		},

		validateModel: function(model){
			const definition = this.currentCollectionSchema.definition;
			for(const key in definition){
				if(typeof model[key] === "undefined"){
					if(definition[key].app_type == "checkbox"){
						model[key] = [];
					}else{
						model[key] = "";
					}
				}
			}
			return true;
		},
		checkboxChecked: function(choice, slug){
			if(!this.currentModel[slug]) return false;
			return this.currentModel[slug].includes(choice);
		},
		wysiwygChanged: function(content, name){
			this.wysiwygContents[name] = content;
		},

		// Private functions
		$_formToJSON: function(formElement){
			const result = {};

			const data = new FormData(formElement);
			for(const entry of data){
				const fieldSlug = entry[0];
				const fieldValue = entry[1];
				if(this.currentCollectionSchema.definition[fieldSlug].app_type === "file"){
					if(fieldValue !== ""){
						if(result[fieldSlug]){
							// Multiple occurence
							result[fieldSlug].push({
								"content-type": fieldValue.type,
								file_name: fieldValue.name,
								file_description: "",
								file: fieldValue
							});
						}else{
							// First occurence
							result[fieldSlug] = [{
								"content-type": fieldValue.type,
								file_name: fieldValue.name,
								file_description: "",
								file: fieldValue
							}];
						}
					}else{
						// (Editing) nothing changed
						result[fieldSlug] = this.currentModel[fieldSlug];
					}
				}else if(this.currentCollectionSchema.definition[fieldSlug].app_type === "checkbox"){
					// Handling multiple choice form
					if(result[fieldSlug]){
						// Multiple occurence
						result[entry[0]] = Array(result[entry[0]]).concat([entry[1]]);
						// Flatten 2D array
						result[entry[0]] = result[entry[0]].reduce(
							function(a, b) {
								return a.concat(b);
							},
							[]
						);
					}else{
						// First occurence
						result[entry[0]] = [entry[1]];
					}
				}else{
					// All other elements
					result[entry[0]] = entry[1];
				}
			}

			// Non-form type fields
			each(this.wysiwygContents, (el, key) => {
				result[key] = el;
			});
			return result;
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

#form{
	.field-container{
		margin-bottom: 1rem;
		display: flex;
		flex-direction: row;
		min-height: 1.5rem;

		.field-name{
			display: flex;
			justify-content: center;
			flex-direction: column;
			min-width: 170px;
		}

		.field{
			display: inline-block;
			width: 500px;

			.v-for-container{
				display: block;
				margin: 0.5rem 0;
			}
		}
	}
}
</style>