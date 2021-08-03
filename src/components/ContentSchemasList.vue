<template>
	<article id="schema-list-container">
		<h1>Schemas</h1>
		<button id="new-button" v-on:click.prevent="renderSchemaForm">New</button>
		<schemas-list-item
			v-for="schema in schemas" :key="schema.tableSlug"
			:schema="schema"
		/>
	</article>
</template>

<script>
import SchemaListItem from "./ContentSchemasListItem.vue";

export default {
	name: "SchemasList",
	components: {
		"schemas-list-item": SchemaListItem
	},
	computed: {
		schemas: function(){
			return this.$store.state.schemas;
		}
	},
	methods: {
		renderSchemaForm: function(tableSlug){
			this.$store.commit("setCurrentCollectionSchema", "");
			this.$store.commit("setContentView", this.$store.state.contentViews.schemasEdit);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#schema-list-container{
		#new-button{
			margin-bottom: 0.5rem;
		}
	}
</style>