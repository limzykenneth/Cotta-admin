<template>
	<section id="page-content">
		<component v-bind:is="currentView"
			:logged-in-user="loggedInUser"
			:schemas="schemas"
			:current-collection="currentCollection"
			:current-collection-schema="currentCollectionSchema"
			:users-list="usersList"
			:current-model="currentModel"
			:current-view-user="currentViewUser"
			:configurations="configurations"
			:files="files"

			v-on:renderModel="renderModel"
			v-on:renderModelForm="renderModelForm"
			v-on:submitModel="submitModel"
			v-on:deleteModel="deleteModel"

			v-on:renderSchemaForm="renderSchemaForm"
			v-on:submitSchema="submitSchema"
			v-on:deleteSchema="deleteSchema"
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
import UserEdit from "./ContentUserEdit.vue";
import UserPage from "./ContentUser.vue";
import ModelPage from "./ContentModel.vue";
import ModelEdit from "./ContentModelEdit.vue";
import AccountPage from "./ContentAccount.vue";
import SettingsPage from "./ContentSettings.vue";
import FilesPage from "./ContentFiles.vue";

export default {
	name: "AppContent",
	components: {
		"app-dashboard": Dashboard,
		"login-page": LoginPage,
		"signup-page": SignupPage,
		"collection-list": CollectionList,
		"schemas-list": SchemasList,
		"schemas-edit": SchemasEdit,
		"users-list": UsersList,
		"user-edit": UserEdit,
		"user-page": UserPage,
		"model-page": ModelPage,
		"model-edit": ModelEdit,
		"account-page": AccountPage,
		"settings-page": SettingsPage,
		"files-page": FilesPage
	},
	props: {
		"loggedInUser": {
			type: String,
			default: ""
		},
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
			type: Object,
			default: function(){
				return {};
			}
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
			type: Object,
			default: function(){
				return {};
			}
		},
		"configurations": {
			type: Array,
			required: true
		},
		"files": {
			type: Array,
			default: () => []
		}
	},
	methods: {
		renderModel: function(tableSlug, uid){
			this.$emit("renderModel", tableSlug, uid);
		},
		renderModelForm: function(tableSlug, uid){
			this.$emit("renderModelForm", tableSlug, uid);
		},
		submitModel: function(model, tableSlug, uid="", schema){
			this.$emit("submitModel", model, tableSlug, uid, schema);
		},
		deleteModel: function(tableSlug, uid){
			this.$emit("deleteModel", tableSlug, uid);
		},

		renderSchemaForm: function(tableSlug){
			this.$emit("renderSchemaForm", tableSlug);
		},
		submitSchema: function(schema){
			this.$emit("submitSchema", schema);
		},
		deleteSchema: function(tableSlug){
			this.$emit("deleteSchema", tableSlug);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#page-content{
		flex-grow: 2;
		width: ~"calc(100vw - 200px)";
		padding: 20px;
		overflow: scroll;
	}
</style>