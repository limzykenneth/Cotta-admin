<template>
	<div class="schema-container">{{ schema.collectionName }}</div>
</template>

<script>
export default {
	name: "SchemasListItem",
	props: {
		"schema": {
			type: Object,
			required: true
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