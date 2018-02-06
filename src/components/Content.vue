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
import Dashboard from "./ContentDashboard.vue";
import LoginPage from "./ContentLogin.vue";
import CollectionList from "./ContentCollectionList.vue";
import SchemasList from "./ContentSchemasList.vue";
import SchemasEdit from "./ContentSchemasEdit.vue";
import UsersList from "./ContentUsersList.vue";
import UsersEdit from "./ContentUsersEdit.vue";
import ModelPage from "./ContentModel.vue";
import ModelEdit from "./ContentModelEdit.vue";

export default {
	name: "AppContent",
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
		"login-page": LoginPage,
		"collection-list": CollectionList,
		"schemas-list": SchemasList,
		"schemas-edit": SchemasEdit,
		"users-list": UsersList,
		"users-edit": UsersEdit,
		"model-page": ModelPage,
		"model-edit": ModelEdit
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