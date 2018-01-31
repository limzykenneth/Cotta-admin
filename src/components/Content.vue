<template>
	<section id="page-content">
		<component v-bind:is="currentView"
			:schemas="schemas"
			:current-collection="currentCollection"
			:current-collection-schema="currentCollectionSchema"
		></component>
	</section>
</template>

<script>
import SchemasList from "./ContentSchemasList.vue";
import Dashboard from "./ContentDashboard.vue";
import CollectionList from "./ContentCollectionList.vue";

export default {
	name: "content",
	props: [
		"schemas",
		"currentView",
		"currentCollection",
		"currentCollectionSchema"
	],
	components: {
		"app-dashboard": Dashboard,
		"schemas-list": SchemasList,
		"collection-list": CollectionList
	},
	methods: {
	}
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#page-content{
		flex-grow: 2;

		margin: 10px;
		padding: 10px;
	}
</style>