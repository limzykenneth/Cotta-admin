<template>
	<article>
		<h1>Schemas</h1>
		<schemas-list-item v-for="schema in schemas" :key="schema.collectionSlug" :schema="schema"></schemas-list-item>
	</article>
</template>

<script>
import SchemaListItem from "./ContentSchemasListItem.vue";

export default {
	name: "schemas-list",
	props: ["schemas"],
	components: {
		"schemas-list-item": SchemaListItem
	}
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";
</style>