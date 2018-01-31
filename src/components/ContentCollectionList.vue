<template>
	<article>
		<h1>{{ currentCollectionSchema.collectionName }}</h1>

		<p v-for="model in currentCollection">{{ model._uid }}</p>
	</article>
</template>

<script>
export default {
	name: "collection-list",
	props: [
		"currentCollection",
		"currentCollectionSchema"
	]
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";
</style>