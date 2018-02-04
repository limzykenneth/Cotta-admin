<template>
	<div id="page-container">
		<app-header
			:site-title="siteTitle"
			:logged-in="loggedIn"

			v-on:renderLogin="renderLogin"
			v-on:logoutUser="logoutUser"
		></app-header>

		<div class="flex-container">
			<app-sidebar :schemas="schemas"
				v-on:renderSchemasList="renderSchemasList"
				v-on:renderDashboard="renderDashboard"
				v-on:renderCollection="renderCollection"
				v-on:renderUsersList="renderUsersList"
			></app-sidebar>
			<app-content
				:schemas="schemas"
				:current-view="currentContentView"
				:current-collection="currentCollection"
				:current-collection-schema="currentCollectionSchema"
				:users-list="usersList"

				v-on:loginUser="loginUser"
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
		renderDashboard: function(){
			this.currentContentView = this.contentViews.dashboard;
		},
		renderSchemasList: function(){
			this.currentContentView = this.contentViews.schemasList;
		},
		renderCollection: function(collectionSlug){
			var request = this.utils.generateRequest(`collections/${collectionSlug}`);
			fetch(request).then((res) => res.json()).then((collection) => {
				this.currentContentView = this.contentViews.collectionList;
				this.currentCollection = collection;
				this.currentCollectionSchema = _.find(this.schemas, function(el){
					return el.collectionSlug == collectionSlug;
				});
			});
		},
		renderUsersList: function(){
			var request = this.utils.generateRequest("users");
			fetch(request).then((res) => res.json()).then((users) => {
				this.currentContentView = "users-list";
				this.usersList = users;
			});
		},
		renderLogin: function(){
			this.currentContentView = "login-page";
		},
		loginUser: function(loginDetails){
			var request = this.utils.generateRequest("tokens/generate_new_token", "POST", loginDetails);
			fetch(request).then((res) => res.json()).then((token) => {
				store.set("access_token", token.access_token);
				this.currentContentView = "app-dashboard";
			});
		},
		logoutUser: function(){
			store.remove("access_token");
			this.schemas = {};
			this.usersList = {};
			this.loggedIn = false;
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