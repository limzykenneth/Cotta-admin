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
				:current-model="currentModel"
				:users-list="usersList"

				v-on:loginUser="loginUser"
				v-on:renderModel="renderModel"
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
			this.$store.commit("setContentView", this.contentViews.usersList);
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

		loginUser: function(loginDetails){
			var request = this.utils.generateRequest("tokens/generate_new_token", "POST", loginDetails);
			fetch(request).then((res) => res.json()).then((token) => {
				store.set("access_token", token.access_token);
				this.$store.commit("setContentView", this.contentViews.dashboard);
				this.$store.dispatch("fetchInitialData");
			});
		},
		logoutUser: function(){
			store.remove("access_token");
			this.$store.commit("updateSchemas", []);
			this.$store.commit("setLoggedIn", false);
			this.$store.commit("updateUsersList", []);
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