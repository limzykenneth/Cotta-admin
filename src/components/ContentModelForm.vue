<template>
	<form id="form" v-on:submit.prevent="submitModel">
		<div class="field-container"
			v-for="field in currentCollectionSchema.fields" :key="field.slug"
		>
			<span class="field-name">
				{{ field.name }}
			</span>

			<span class="field" v-if="field.type == 'checkbox' || field.type == 'radio'">
				<span class="v-for-container" v-for="(choice, key) in field.properties.choices">
					<input
						:type="field.type"
						:name="field.slug"
						:value="choice"
						:id="choice"
					>
					<label :for="choice">{{ key }}</label>
				</span>
			</span>
			<span class="field" v-else>
				<input
					:type="field.type"
					:name="field.slug"
				>
			</span>

		</div>

		<input id="submit" type="submit" name="submit" value="Submit">
	</form>
</template>

<script>
export default{
	name: "ModelForm",
	props: {
		"currentCollectionSchema": {
			type: Object,
			required: true
		}
	},
	methods: {
		submitModel: function(e){
			var result = this.$_formToJSON(e.target);
			var slug = this.currentCollectionSchema.collectionSlug;
			var id = null;

			if(this.validateModel(result)){
				this.$emit("submitModel", result, slug, id);
			}else{
				// Validation failed, show message
			}
		},

		validateModel: function(model){
			var fields = this.currentCollectionSchema.fields;
			for(let i=0; i<fields.length; i++){
				if(typeof model[fields[i].slug] == "undefined"){
					if(fields[i].type == "checkbox"){
						model[fields[i].slug] = [];
					}else{
						model[fields[i].slug] = "";
					}
				}

				if(fields[i].type == "checkbox" && !Array.isArray(model[fields[i].slug])){
					model[fields[i].slug] = [model[fields[i].slug]];
				}
				// Other validations go here, return false if failed
			}
			return true;
		},

		// Private functions
		$_formToJSON: function(formElement){
			var result = {};

			var data = new FormData(formElement);
			for(const entry of data){
				if(result[entry[0]]){
					result[entry[0]] = Array(result[entry[0]]).concat([entry[1]]);
					// Flatten 2D array
					result[entry[0]] = result[entry[0]].reduce(
						function(a, b) {
							return a.concat(b);
						},
						[]
					);
				}else{
					result[entry[0]] = entry[1];
				}
			}
			return result;
		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";

#form {

}
</style>