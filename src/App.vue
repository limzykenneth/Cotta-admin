<template>
	<div id="page-container">
		<app-header
			:site-title="siteTitle"
			:logged-in="loggedIn"

			v-on:renderLogin="renderLogin"
			v-on:logoutUser="logoutUser"
			v-on:renderSignup="renderSignup"
			v-on:renderAccount="renderAccount"
		></app-header>

		<div class="flex-container">
			<app-sidebar :schemas="schemas"
				v-on:renderSchemasList="renderSchemasList"
				v-on:renderDashboard="renderDashboard"
				v-on:renderCollection="renderCollection"
				v-on:renderUsersList="renderUsersList"
			></app-sidebar>
			<app-content
				:logged-in-user="loggedInUser"
				:schemas="schemas"
				:current-view="currentContentView"
				:current-collection="currentCollection"
				:current-collection-schema="currentCollectionSchema"
				:current-model="currentModel"
				:users-list="usersList"
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
				v-on:renderUserForm="renderUserForm"
				v-on:deleteUser="deleteUser"
				v-on:submitUser="submitUser"

				v-on:submitChangePassword="submitChangePassword"
			></app-content>
		</div>
	</div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import Content from "./components/Content.vue";

export default {
	name: "app",
	components: {
		"app-header": Header,
		"app-sidebar": Sidebar,
		"app-content": Content
	},
	methods: {
		/**
		 * Render methods. Used to render different pages.
		 */
		renderDashboard: function(){
			this.$store.commit("setContentView", this.contentViews.dashboard);
		},
		renderSchemasList: function(){
			this.$store.commit("setContentView", this.contentViews.schemasList);
		},
		renderCollection: function(collectionSlug){
			this.$store.dispatch("fetchCollection", collectionSlug).then(() => {
				this.$store.commit("setContentView", this.contentViews.collectionList);
			});
		},
		renderUsersList: function(){
			this.$store.dispatch("fetchUsersList").then(() => {
				this.$store.commit("setContentView", this.contentViews.usersList);
			});
		},
		renderLogin: function(){
			this.$store.commit("setContentView", this.contentViews.loginPage);
		},
		renderModel: function(collectionSlug, uid){
			this.$store.dispatch("fetchModel", {
				collectionSlug,
				uid
			}).then(() => {
				this.$store.commit("setContentView", this.contentViews.modelPage);
			});
		},
		renderModelForm: function(collectionSlug, uid){
			this.$store.dispatch("fetchCollection", collectionSlug).then(() => {
				if(!uid){
					// If not uid is defined, render blank form
					this.$store.commit("setCurrentModel", {
						model: {},
						collectionSlug
					});
					this.$store.commit("setContentView", this.contentViews.modelEdit);
				}else{
					// If uid is defined, fetch model then render populated form
					this.$store.dispatch("fetchModel", {
						collectionSlug,
						uid
					}).then(() => {
						this.$store.commit("setContentView", this.contentViews.modelEdit);
					});
				}
			});
		},
		renderAccount: function(){
			this.$store.commit("setContentView", this.contentViews.accountPage);
		},

		/**
		 * Model related methods. Used to manipulate individual model
		 */
		submitModel: function(model, collectionSlug, uid=""){
			this.$store.dispatch("submitModel", {
				model,
				collectionSlug,
				uid
			}).then((model) => {
				this.$store.commit("setCurrentModel", {
					model,
					collectionSlug
				});
				this.$store.commit("setContentView", this.contentViews.modelPage);
			});
		},
		deleteModel: function(collectionSlug, uid){
			this.$store.dispatch("deleteModel", {
				collectionSlug,
				uid
			}).then((model) => {
				this.$store.commit("setContentView", this.contentViews.collectionList);
			});
		},

		/**
		 * Schema related methods. Used to render schema form and manipulate
		 * individual schema
		 */
		renderSchemaForm: function(collectionSlug=""){
			this.$store.commit("setCurrentCollectionSchema", collectionSlug);
			this.$store.commit("setContentView", this.contentViews.schemasEdit);
		},
		submitSchema: function(schema){
			this.$store.dispatch("submitSchema", schema).then((schema) => {
				this.$store.commit("setContentView", this.contentViews.schemasList);
			});
		},
		deleteSchema: function(collectionSlug){
			this.$store.dispatch("deleteSchema", collectionSlug).then((message) => {
				this.$store.commit("setContentView", this.contentViews.schemasList);
			});
		},

		/**
		 * User related methods. Used to render user form and manipulate
		 * individual user's data
		 */
		renderUser: function(username){
			this.$store.dispatch("fetchUser", username).then((user) => {
				this.$store.commit("setCurrentViewUser", user);
				this.$store.commit("setContentView", this.contentViews.userPage);
			});
		},
		renderUserForm: function(username){
			if(username){
				this.$store.dispatch("fetchUser", username).then((user) => {
					this.$store.commit("setCurrentViewUser", user);
					this.$store.commit("setContentView", this.contentViews.userEdit);
				});
			}else{
				this.$store.commit("setCurrentViewUser", {});
				this.$store.commit("setContentView", this.contentViews.userEdit);
			}
		},
		deleteUser: function(username){
			this.$store.dispatch("deleteUser", username).then((message) => {
				this.$store.dispatch("fetchUsersList");
			});
		},
		submitUser: function(user){
			this.$store.dispatch("submitUser", user).then((res) => {
				console.log(res);
				this.$store.commit("setContentView", this.contentViews.dashboard);
			});
		},

		/**
		 * Login/logout/signup related methods.
		 */
		loginUser: function(loginDetails){
			this.$store.dispatch("loginUser", loginDetails).then((res) => {
				this.$store.commit("setContentView", this.contentViews.dashboard);
			}).catch((err) => {
				if(err.message === "Authentication Failed"){
					this.$store.commit("setContentView", this.contentViews.loginPage);
				}else{
					console.error(err);
				}
			});
		},
		logoutUser: function(){
			store.remove("access_token");
			this.$store.commit("updateSchemas", []);
			this.$store.commit("setLoggedIn", false);
			this.$store.commit("updateUsersList", []);
			this.$store.commit("setLoggedInUser", "");
		},
		signupUser: function(signupDetails){
			this.$store.dispatch("signupUser", signupDetails).then((res) => {
				console.log(res);
				this.$store.commit("setContentView", this.contentViews.loginPage);
			});
		},
		renderSignup: function(){
			this.$store.commit("setContentView", this.contentViews.signupPage);
		},

		submitChangePassword: function(result){
			this.$store.dispatch("submitChangePassword", result).then((res) => {
				console.log(res);
				this.$store.commit("setContentView", this.contentViews.dashboard);
			});
		}
	}
};
</script>

<style lang="less" scoped>
#page-container{
	height: 100vh;

	.flex-container{
		display: flex;
		height: ~"calc(100% - 50px)";
	}
}
</style>

<style lang="less">
	@import "./global.less";
</style>