<template>
	<section id="page-content">
		<component v-bind:is="currentView"
			:schemas="schemas"
			:current-collection="currentCollection"
			:current-collection-schema="currentCollectionSchema"
			:users-list="usersList"
		></component>
	</section>
</template>

<script>
import SchemasList from "./ContentSchemasList.vue";
import Dashboard from "./ContentDashboard.vue";
import CollectionList from "./ContentCollectionList.vue";
import UsersList from "./ContentUsersList.vue";

export default {
	name: "content",
	props: [
		"schemas",
		"currentView",
		"currentCollection",
		"currentCollectionSchema",
		"usersList"
	],
	components: {
		"app-dashboard": Dashboard,
		"schemas-list": SchemasList,
		"collection-list": CollectionList,
		"users-list": UsersList
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