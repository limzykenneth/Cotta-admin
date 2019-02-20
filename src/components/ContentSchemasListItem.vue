<template>
	<div class="schema-container">
		<span class="collection-name">{{ schema.collectionName }}</span>
		<button class="edit-button" v-on:click.prevent="renderSchemaForm">Edit</button>
		<button class="delete-button" v-on:click.prevent="deleteSchema">Delete</button>
	</div>
</template>

<script>
export default {
	name: "SchemasListItem",
	props: {
		"schema": {
			type: Object,
			required: true
		}
	},
	methods: {
		renderSchemaForm: function(){
			this.$emit("renderSchemaForm", this.schema.collectionSlug);
		},
		deleteSchema: function(){
			this.$emit("deleteSchema", this.schema.collectionSlug);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	.schema-container{
		.list-item();
	}
</style>