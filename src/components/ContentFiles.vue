<template>
	<article id="files-container">
		<h1>Files</h1>

		<div id="files-flex">
			<files-item v-for="file in files" :key="file.uid"
				:file="file"
				v-on:click.native="selectFile(file)"
			/>
		</div>

		<files-drawer
			v-if="selectedFile !== null"
			:file="selectedFile"

			v-on:hideDrawer="hideDrawer"
		/>
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
	data: function(){
		return {
			selectedFile: null
		};
	},
	computed: {
		files: function(){
			return this.$store.state.files;
		}
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
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#files-container{
		height: 125%;

		#files-flex{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>