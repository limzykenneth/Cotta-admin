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
	components: {
		"model-form": ModelForm
	},
	methods: {
		submitModel: function(model, collectionSlug, uid=""){
			this.$emit("submitModel", model, collectionSlug, uid);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>