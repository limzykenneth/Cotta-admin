<template>
	<div id="page-content">
		<app-header :site-title="siteTitle"></app-header>
		<app-sidebar></app-sidebar>
	</div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";

export default {
	name: "app",
	components: {
		"app-header": Header,
		"app-sidebar": Sidebar
	}
};
</script>

<style lang="less">
	@import "/global.less";
</style>