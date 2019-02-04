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

		<app-toast
			:toast-message="toastMessage"
		></app-toast>

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
import Toast from "./components/Toast.vue";
import Content from "./components/Content.vue";

export default {
	name: "app",
	components: {
		"app-header": Header,
		"app-sidebar": Sidebar,
		"app-toast": Toast,
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
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
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
			}).then((model) => {
				this.$store.commit("setContentView", this.contentViews.modelPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderModelForm: function(collectionSlug, uid){
			this.$store.dispatch("fetchCollection", collectionSlug).then((collection) => {
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
					}).then((model) => {
						this.$store.commit("setContentView", this.contentViews.modelEdit);
					}).catch((err) => {
						this.$store.commit("setToastMessage", err.detail);
					});
				}
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
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
				this.$store.commit("setToastMessage", "Created new model");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		deleteModel: function(collectionSlug, uid){
			this.$store.dispatch("deleteModel", {
				collectionSlug,
				uid
			}).then((model) => {
				this.$store.commit("setContentView", this.contentViews.collectionList);
				this.$store.commit("setToastMessage", "Deleted model");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
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
				this.$store.commit("setToastMessage", `Created schema "${schema.collectionName}".`);
			});
		},
		deleteSchema: function(collectionSlug){
			this.$store.dispatch("deleteSchema", collectionSlug).then((response) => {
				this.$store.commit("setContentView", this.contentViews.schemasList);
				this.$store.commit("setToastMessage", response.message);
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
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
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
			this.$store.dispatch("deleteUser", username).then((res) => {
				this.$store.commit("setToastMessage", res.message);
				this.$store.dispatch("fetchUsersList");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		submitUser: function(user){
			this.$store.dispatch("submitUser", user).then((res) => {
				this.$store.commit("setContentView", this.contentViews.dashboard);
				this.$store.commit("setToastMessage", res.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		/**
		 * Login/logout/signup related methods.
		 */
		loginUser: function(loginDetails){
			this.$store.dispatch("loginUser", loginDetails).then((res) => {
				this.$store.commit("setContentView", this.contentViews.dashboard);
			}).catch((err) => {
				if(err.title === "Authentication Failed"){
					this.$store.commit("setContentView", this.contentViews.loginPage);
				}else{
					console.error(err);
				}
				this.$store.commit("setToastMessage", err.detail);
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
				this.$store.commit("setContentView", this.contentViews.loginPage);
				this.$store.commit("setToastMessage", "You have sucessfully signed up!");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderSignup: function(){
			this.$store.commit("setContentView", this.contentViews.signupPage);
		},

		submitChangePassword: function(result){
			this.$store.dispatch("submitChangePassword", result).then((res) => {
				this.$store.commit("setContentView", this.contentViews.dashboard);
				this.$store.commit("setToastMessage", res.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
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