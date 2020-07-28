<template>
	<model-form
		:current-collection-schema="currentCollectionSchema"
		:current-model="currentModel"

		v-on:submitModel="submitModel"
	></model-form>
</template>

<script>
import ModelForm from "./ContentModelForm.vue";

export default{
	name: "ModelEdit",
	components: {
		"model-form": ModelForm
	},
	props: {
		"currentModel": {
			type: Object,
			default: function(){
				return {};
			}
		},
		"currentCollectionSchema": {
			type: Object,
			required: true
		}
	},
	methods: {
		submitModel: function(model, tableSlug, uid="", schema){
			this.$emit("submitModel", model, tableSlug, uid, schema);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";
</style>