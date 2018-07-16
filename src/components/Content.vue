<template>
	<section id="page-content">
		<component v-bind:is="currentView"
			:schemas="schemas"
			:current-collection="currentCollection"
			:current-collection-schema="currentCollectionSchema"
			:users-list="usersList"
			:current-model="currentModel"
			:current-view-user="currentViewUser"

			v-on:loginUser="loginUser"
			v-on:renderLogin="renderLogin"
			v-on:signupUser="signupUser"
			v-on:renderSignup="renderSignup"

			v-on:renderModel="renderModel"
			v-on:renderModelForm="renderModelForm"
			v-on:submitModel="submitModel"
			v-on:deleteModel="deleteModel"

			v-on:renderSchemaForm="renderSchemaForm"
			v-on:submitSchema="submitSchema"
			v-on:deleteSchema="deleteSchema"

			v-on:renderUser="renderUser"
			v-on:deleteUser="deleteUser"
		></component>
	</section>
</template>

<script>
import Dashboard from "./ContentDashboard.vue";
import LoginPage from "./ContentLogin.vue";
import SignupPage from "./ContentSignup.vue";
import CollectionList from "./ContentCollectionList.vue";
import SchemasList from "./ContentSchemasList.vue";
import SchemasEdit from "./ContentSchemasEdit.vue";
import UsersList from "./ContentUsersList.vue";
import UsersEdit from "./ContentUsersEdit.vue";
import UserPage from "./ContentUser.vue";
import ModelPage from "./ContentModel.vue";
import ModelEdit from "./ContentModelEdit.vue";

export default {
	name: "AppContent",
	props: {
		"schemas": {
			type: Array,
			default: function(){
				return [];
			}
		},
		"currentView": {
			type: String,
			default: "app-dashboard",
			required: true
		},
		"currentCollection": {
			type: Array,
			default: function(){
				return [];
			}
		},
		"currentCollectionSchema": {
			type: Object
		},
		"currentModel": {
			type: Object,
			default: function(){
				return {};
			}
		},
		"usersList": {
			type: Array,
			default: function(){
				return [];
			}
		},
		"currentViewUser": {
			type: Object
		}
	},
	components: {
		"app-dashboard": Dashboard,
		"login-page": LoginPage,
		"signup-page": SignupPage,
		"collection-list": CollectionList,
		"schemas-list": SchemasList,
		"schemas-edit": SchemasEdit,
		"users-list": UsersList,
		"users-edit": UsersEdit,
		"user-page": UserPage,
		"model-page": ModelPage,
		"model-edit": ModelEdit
	},
	methods: {
		loginUser: function(loginDetails){
			this.$emit("loginUser", loginDetails);
		},
		renderLogin: function(){
			this.$emit("renderLogin");
		},
		signupUser: function(signupDetails){
			this.$emit("signupUser", signupDetails);
		},
		renderSignup: function(){
			this.$emit("renderSignup");
		},

		renderModel: function(collectionSlug, uid){
			this.$emit("renderModel", collectionSlug, uid);
		},
		renderModelForm: function(collectionSlug, uid){
			this.$emit("renderModelForm", collectionSlug, uid);
		},
		submitModel: function(model, collectionSlug, uid=""){
			this.$emit("submitModel", model, collectionSlug, uid);
		},
		deleteModel: function(collectionSlug, uid){
			this.$emit("deleteModel", collectionSlug, uid);
		},

		renderSchemaForm: function(collectionSlug){
			this.$emit("renderSchemaForm", collectionSlug);
		},
		submitSchema: function(schema){
			this.$emit("submitSchema", schema);
		},
		deleteSchema: function(collectionSlug){
			this.$emit("deleteSchema", collectionSlug);
		},

		renderUser: function(username){
			this.$emit("renderUser", username);
		},
		deleteUser: function(username){
			this.$emit("deleteUser", username);
		}
	}
};
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