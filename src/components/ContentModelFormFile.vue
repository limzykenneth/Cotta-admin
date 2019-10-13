<template>
	<div id="file-input-container">
		<label class="input-label" :for="name">Browse</label>
		<input type="file" class="file-input" multiple
			:name="name"
			:id="name"

			v-on:change="fileChanged"
		>
		<ol class="file-preview">
			<li v-for="(file, index) in files" :key="index">
				<p class="info">
					{{ file.fileName }}
				</p>

				<div class="preview">
					<img class="preview-image"
						:src="file.fileLink"
					>
				</div>
			</li>
		</ol>
	</div>
</template>

<script>
export default{
	name: "FileInput",
	props: {
		"name": {
			type: String,
			required: true
		},
		"filesMetadata": {
			type: [Array, Object],
			default: function(){
				return null;
			}
		}
	},
	data: function(){
		let filesArray;
		if(Array.isArray(this.filesMetadata) && this.filesMetadata.length !== 0){
			filesArray = _.map(this.filesMetadata, (fileMetadata, i) => {
				return {
					fileName: fileMetadata.file_name,
					fileLink: fileMetadata.permalink
				};
			});
			return {
				files: filesArray
			}
		}else if(this.filesMetadata){
			return {
				files: [{
					fileName: this.filesMetadata.file_name,
					fileLink: this.filesMetadata.permalink
				}]
			}
		}

		return {
			files: [{
				fileName: "No files currently selected for upload",
				fileLink: ""
			}]
		};
	},
	methods: {
		fileChanged: function(e){
			const files = e.srcElement.files;
			this.files = [];
			_.each(files, (file, i) => {
				this.files.push({
					fileName: file.name,
					fileLink: window.URL.createObjectURL(file)
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

#file-input-container{
	.input-label{
		cursor: pointer;
		height: 1.9rem;
		padding: 0.45rem 1.2rem;
		min-width: 90px;
		border-radius: 25px;
		box-shadow: none;
		border: none;
		background-color: #ddd;

		&:hover{
			background-color: darken(#ddd, 20%);
		}
	}

	.file-input{
		opacity: 0;
		width: 0;
		height: 0;
	}

	.file-preview{
		width: 100%;
		min-height: 75px;
		padding: 0;
		list-style: none;
		margin: 0.7rem 0;

		li{
			width: 100%;
			height: 75px;
			display: flex;
			outline: 1px solid black;
			margin: 0;
			align-items: center;
			justify-content: space-between;

			.info{
				padding: 0 1rem;
			}

			.preview{
				height: 75px;

				img{
					max-height: 75px;
				}
			}
		}
	}
}
</style>