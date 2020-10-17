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