<template>
	<article id="files-container">
		<h1>Files</h1>

		<div id="files-flex">
			<files-item v-for="file in files" :key="file.uid"
				:file="file"
			></files-item>
		</div>
	</article>
</template>

<script>
import FilesItem from "./ContentFilesItem.vue";

export default {
	name: "FilesPage",
	components: {
		"files-item": FilesItem
	},
	props: {
		"files": {
			type: Array,
			required: true
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#files-container{
		#files-flex{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>