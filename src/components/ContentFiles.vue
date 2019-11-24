<template>
	<article id="files-container">
		<h1>Files</h1>

		<div id="files-flex">
			<files-item v-for="file in files" :key="file.uid"
				:file="file"
				v-on:click.native="selectFile(file)"
			></files-item>
		</div>

		<files-drawer
			v-if="selectedFile !== null"
			:file="selectedFile"

			v-on:hideDrawer="hideDrawer"
			v-on:deleteFile="deleteFile"
		></files-drawer>
	</article>
</template>

<script>
import FilesItem from "./ContentFilesItem.vue";
import FilesDrawer from "./ContentFilesDrawer.vue";

export default {
	name: "FilesPage",
	components: {
		"files-item": FilesItem,
		"files-drawer": FilesDrawer
	},
	props: {
		"files": {
			type: Array,
			required: true
		}
	},
	data: function(){
		return {
			selectedFile: null
		};
	},
	methods: {
		selectFile: function(file){
			if(this.selectedFile !== file){
				this.selectedFile = file;
			}else{
				this.$set(this, "selectedFile", null);
			}
		},
		hideDrawer: function(){
			this.$set(this, "selectedFile", null);
		},
		deleteFile: function(file){
			this.$emit("deleteFile", file);
			this.$set(this, "selectedFile", null);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#files-container{
		height: 125%;

		#files-flex{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>