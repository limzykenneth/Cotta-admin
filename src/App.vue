<template>
	<div id="page-container">
		<app-header></app-header>

		<app-toast></app-toast>

		<div class="flex-container">
			<app-sidebar></app-sidebar>

			<app-content></app-content>
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