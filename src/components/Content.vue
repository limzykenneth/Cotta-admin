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
			v-on:renderModelForm="renderModelForm"
			v-on:submitModel="submitModel"
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
import ModelNew from "./ContentModelNew.vue";

export default {
	name: "AppContent",
	props: {
		"schemas": {
			type: Array,
			default: []
		},
		"currentView": {
			type: String,
			default: "app-dashboard",
			required: true
		},
		"currentCollection": {
			type: Array,
			default: []
		},
		"currentCollectionSchema": {
			type: Object,
			default: {}
		},
		"currentModel": {
			type: Object,
			default: {}
		},
		"usersList": {
			type: Array,
			default: []
		}
	},
	components: {
		"app-dashboard": Dashboard,
		"login-page": LoginPage,
		"collection-list": CollectionList,
		"schemas-list": SchemasList,
		"schemas-edit": SchemasEdit,
		"users-list": UsersList,
		"users-edit": UsersEdit,
		"model-page": ModelPage,
		"model-edit": ModelEdit,
		"model-new": ModelNew
	},
	methods: {
		loginUser: function(loginDetails){
			this.$emit("loginUser", loginDetails);
		},
		renderModel: function(collectionSlug, uid){
			this.$emit("renderModel", collectionSlug, uid);
		},
		renderModelForm: function(){
			this.$emit("renderModelForm");
		},
		submitModel: function(model, collectionSlug, id=""){
			this.$emit("submitModel", model, collectionSlug, id);
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