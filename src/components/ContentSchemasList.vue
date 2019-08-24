<template>
	<article id="schema-list-container">
		<h1>Schemas</h1>
		<button id="new-button" v-on:click.prevent="renderSchemaForm">New</button>
		<schemas-list-item
			v-for="schema in schemas" :key="schema.tableSlug"
			:schema="schema"

			v-on:renderSchemaForm="renderSchemaForm"
			v-on:deleteSchema="deleteSchema"
		></schemas-list-item>
	</article>
</template>

<script>
import SchemaListItem from "./ContentSchemasListItem.vue";

export default {
	name: "SchemasList",
	components: {
		"schemas-list-item": SchemaListItem
	},
	props: {
		"schemas": {
			type: Array,
			required: true
		}
	},
	methods: {
		renderSchemaForm: function(tableSlug){
			this.$emit("renderSchemaForm", tableSlug);
		},
		deleteSchema: function(tableSlug){
			this.$emit("deleteSchema", tableSlug);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#schema-list-container{
		#new-button{
			margin-bottom: 0.5rem;
		}
	}
</style>