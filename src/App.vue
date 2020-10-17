<template>
	<div id="page-container">
		<app-header
			:site-title="siteTitle"
			:logged-in="loggedIn"
		></app-header>

		<app-toast
			:toast-message="toastMessage"
		></app-toast>

		<div class="flex-container">
			<app-sidebar :schemas="schemas"
				:logged-in="loggedIn"
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
				:configurations="configurations"
				:files="files"

				v-on:signupUser="signupUser"

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

				v-on:submitConfig="submitConfig"

				v-on:deleteFile="deleteFile"
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
	name: "App",
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
		renderModel: function(tableSlug, uid){
			this.$store.dispatch("fetchModel", {
				tableSlug,
				uid
			}).then((model) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.modelPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderModelForm: function(tableSlug, uid){
			this.$store.dispatch("fetchCollection", tableSlug).then((collection) => {
				if(!uid){
					// If not uid is defined, render blank form
					this.$store.commit("setCurrentModel", {
						model: {},
						tableSlug
					});
					this.$store.commit("setContentView", this.$store.state.contentViews.modelEdit);
				}else{
					// If uid is defined, fetch model then render populated form
					this.$store.dispatch("fetchModel", {
						tableSlug,
						uid
					}).then((model) => {
						this.$store.commit("setContentView", this.$store.state.contentViews.modelEdit);
					}).catch((err) => {
						this.$store.commit("setToastMessage", err.detail);
					});
				}
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		/**
		 * Model related methods. Used to manipulate individual model
		 */
		submitModel: function(model, tableSlug, uid="", schema){
			this.$store.dispatch("submitModel", {
				model,
				tableSlug,
				uid,
				schema
			}).then((model) => {
				this.$store.commit("setCurrentModel", {
					model,
					tableSlug
				});
				this.$store.commit("setContentView", this.$store.state.contentViews.modelPage);
				this.$store.commit("setToastMessage", "Created new model");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.message || err.detail);
			});
		},
		deleteModel: function(tableSlug, uid){
			this.$store.dispatch("deleteModel", {
				tableSlug,
				uid
			}).then((model) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.collectionList);
				this.$store.commit("setToastMessage", "Deleted model");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		/**
		 * Schema related methods. Used to render schema form and manipulate
		 * individual schema
		 */
		renderSchemaForm: function(tableSlug=""){
			this.$store.commit("setCurrentCollectionSchema", tableSlug);
			this.$store.commit("setContentView", this.$store.state.contentViews.schemasEdit);
		},
		submitSchema: function(schema){
			this.$store.dispatch("submitSchema", schema).then((type) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.schemasList);
				if(type === "new"){
					this.$store.commit("setToastMessage", `Created schema "${schema.tableName}".`);
				}else if(type === "edit"){
					this.$store.commit("setToastMessage", `Edited schema "${schema.tableName}".`);
				}
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		deleteSchema: function(tableSlug){
			this.$store.dispatch("deleteSchema", tableSlug).then((response) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.schemasList);
				this.$store.commit("setToastMessage", response.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		/**
		 * User related methods. Used to render user form and manipulate
		 * individual user's data
		 */
		renderUser: function(username){
			this.$store.dispatch("fetchUser", username).then((user) => {
				this.$store.commit("setCurrentViewUser", user);
				this.$store.commit("setContentView", this.$store.state.contentViews.userPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderUserForm: function(username){
			if(username){
				this.$store.dispatch("fetchUser", username).then((user) => {
					this.$store.commit("setCurrentViewUser", user);
					this.$store.commit("setContentView", this.$store.state.contentViews.userEdit);
				});
			}else{
				this.$store.commit("setCurrentViewUser", {});
				this.$store.commit("setContentView", this.$store.state.contentViews.userEdit);
			}
		},
		deleteUser: function(username){
			this.$store.dispatch("deleteUser", username).then((res) => {
				this.$store.commit("setToastMessage", res.message);
				this.$store.dispatch("fetchUsersList").catch((err) => {
					this.$store.commit("setToastMessage", err.detail);
				});
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		submitUser: function(user){
			this.$store.dispatch("submitUser", user).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.dashboard);
				this.$store.commit("setToastMessage", res.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		/**
		 * Login/logout/signup related methods.
		 */
		signupUser: function(signupDetails){
			this.$store.dispatch("signupUser", signupDetails).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
				this.$store.commit("setToastMessage", "You have sucessfully signed up!");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		submitChangePassword: function(result){
			this.$store.dispatch("submitChangePassword", result).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.dashboard);
				this.$store.commit("setToastMessage", res.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},

		/**
		 * Settings/configurations related methods
		 */
		submitConfig: function(result){
			this.$store.dispatch("submitConfigurations", result).then((res) => {
				this.$store.commit("setToastMessage", `Config "${res.config_name}" changed.`);
			});
		},

		/**
		 * Files metadata manipulation methods
		 */
		deleteFile: function(file){
			this.$store.dispatch("deleteFile", file).then((res) => {
				this.$store.commit("setToastMessage", res.detail);
				return this.$store.dispatch("fetchFiles");
			}).then((res) => {
				this.$store.commit("setFiles", res);
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