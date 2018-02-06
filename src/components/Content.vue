<template>
	<section id="page-content">
		<component v-bind:is="currentView"
			:schemas="schemas"
			:current-collection="currentCollection"
			:current-collection-schema="currentCollectionSchema"
			:users-list="usersList"
			:current-model="currentModel"

			v-on:loginUser="loginUser"

			v-on:renderModel="renderModel"
		></component>
	</section>
</template>

<script>
import SchemasList from "./ContentSchemasList.vue";
import Dashboard from "./ContentDashboard.vue";
import CollectionList from "./ContentCollectionList.vue";
import UsersList from "./ContentUsersList.vue";
import LoginPage from "./ContentLogin.vue";
import ModelPage from "./ContentModel.vue";

export default {
	name: "content",
	props: [
		"schemas",
		"currentView",
		"currentCollection",
		"currentCollectionSchema",
		"currentModel",
		"usersList"
	],
	components: {
		"app-dashboard": Dashboard,
		"schemas-list": SchemasList,
		"collection-list": CollectionList,
		"users-list": UsersList,
		"login-page": LoginPage,
		"model-page": ModelPage
	},
	methods: {
		loginUser: function(loginDetails){
			this.$emit("loginUser", loginDetails);
		},
		renderModel: function(collectionSlug, uid){
			this.$emit("renderModel", collectionSlug, uid);
		}
	}
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#page-content{
		flex-grow: 2;

		margin: 10px;
		padding: 10px;
		overflow: scroll;
	}
</style>