<template>
	<div id="file-input-container">
		<label class="input-label" :for="name">Browse</label>
		<input type="file" class="file-input"
			:name="name"
			:id="name"

			v-on:change="fileChanged"
		>
		<ol class="file-preview">
			<li>
				<p class="info">
					{{ fileName }}
				</p>

				<div class="preview">
					<img class="preview-image"
						:src="fileLink"
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
		"fileMetadata": {
			type: Object,
			default: function(){
				return null;
			}
		}
	},
	data: function(){
		return {
			fileName: this.fileMetadata ? this.fileMetadata.file_name : "No files currently selected for upload",
			fileLink: this.fileMetadata ? this.fileMetadata.permalink : ""
		};
	},
	methods: {
		fileChanged: function(e){
			const files = e.srcElement.files;
			// NOTE: Still need to implement multi file input field
			if(files.length > 0){
				const file = files[0];
				this.fileName = file.name;
				this.fileLink = window.URL.createObjectURL(file);
			}
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
		height: 75px;
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