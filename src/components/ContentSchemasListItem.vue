<template>
	<div class="schema-container">
		{{ schema.collectionName }} <button v-on:click.prevent="renderSchemaForm">Edit</button>
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
			this.$emit("renderSchemaForm");
		}
	}
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	.schema-container{
		border: 1px solid black;
		padding: 10px;
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>