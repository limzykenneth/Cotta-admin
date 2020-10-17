<template>
	<div class="schema-container">
		<span class="collection-name">{{ schema.tableName }}</span>
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
			this.$store.commit("setCurrentCollectionSchema", this.schema.tableSlug);
			this.$store.commit("setContentView", this.$store.state.contentViews.schemasEdit);
		},
		deleteSchema: function(){
			this.$store.dispatch("deleteSchema", this.schema.tableSlug).then((response) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.schemasList);
				this.$store.commit("setToastMessage", response.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	.schema-container{
		.list-item();
	}
</style>