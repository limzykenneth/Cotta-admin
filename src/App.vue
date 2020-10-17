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

				v-on:renderSchemaForm="renderSchemaForm"
				v-on:submitSchema="submitSchema"
				v-on:deleteSchema="deleteSchema"
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
		 * Login/logout/signup related methods.
		 */
		signupUser: function(signupDetails){
			this.$store.dispatch("signupUser", signupDetails).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
				this.$store.commit("setToastMessage", "You have sucessfully signed up!");
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