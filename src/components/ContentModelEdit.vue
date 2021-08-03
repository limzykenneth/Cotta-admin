<template>
	<model-form
		:current-collection-schema="currentCollectionSchema"
		:current-model="currentModel"

		v-on:submitModel="submitModel"
	/>
</template>

<script>
import ModelForm from "./ContentModelForm.vue";

export default{
	name: "ModelEdit",
	components: {
		"model-form": ModelForm
	},
	computed: {
		currentCollectionSchema: function(){
			return this.$store.state.currentCollectionSchema;
		},
		currentModel: function(){
			return this.$store.state.currentModel;
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