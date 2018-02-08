<template>
	<model-form
		:current-collection-schema="currentCollectionSchema"
		:current-collection="currentCollection"

		v-on:submitModel="submitModel"
	></model-form>
</template>

<script>
import ModelForm from "./ContentModelForm.vue";

export default{
	name: "ModelNew",
	props: {
		"currentCollection": {
			type: Array,
			required: true
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
		submitModel: function(model, collectionSlug){
			this.$emit("submitModel", model, collectionSlug);
		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>