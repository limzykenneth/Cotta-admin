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
		submitModel: function(model, tableSlug, uid=""){
			this.$emit("submitModel", model, tableSlug, uid);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>