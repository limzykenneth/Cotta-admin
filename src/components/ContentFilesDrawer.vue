<template>
	<section id="file-drawer-container">
		<div class="file-thumbnail-container">
			<img class="file-thumbnail"
				v-if="file['content-type'].startsWith('image/')"
				:src="file.file_permalink"
			>
		</div>

		<div class="file-info">
			<div class="file-info-field">
				<span class="file-drawer-labels">File name:</span><span>{{ file.file_name }}</span>
			</div>
			<div class="file-info-field">
				<span class="file-drawer-labels">File type:</span><span>{{ file["content-type"] }}</span>
			</div>
			<div class="file-info-field">
				<span class="file-drawer-labels">File size:</span><span>{{ file.file_size }}</span>
			</div>
			<div class="file-info-field">
				<span class="file-drawer-labels">File link:</span><span>{{ file.file_permalink }}</span>
			</div>

			<div class="file-actions">
				<button class="delete-button">Delete</button>
			</div>
		</div>

		<button id="hide-button"
			v-on:click.prevent="hideDrawer"
		><i class="fa fa-caret-down" aria-hidden="true"></i></button>
	</section>
</template>

<script>
export default {
	name: "FilesDrawer",
	props: {
		"file": {
			type: Object,
			required: true
		}
	},
	methods: {
		hideDrawer: function(){
			this.$emit("hideDrawer");
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#file-drawer-container{
		position: fixed;
		bottom: 0;
		right: 20px;
		width: ~"calc(100% - 220px)";
		background: #aaaaaa;
		display: flex;
		padding: 10px;

		.file-thumbnail-container{
			max-width: 250px;
			max-height: 250px;
			text-align: center;
			margin: 10px;

			.file-thumbnail{
				display: inline-block;
				max-width: 100%;
				max-height: 100%;
			}
		}

		.file-info{
			margin: 10px 0;

			.file-info-field{
				margin-bottom: 5px;

				.file-drawer-labels{
					display: inline-block;
					font-weight: bold;
					width: 100px;
				}
			}

			.file-actions{
				position: absolute;
				bottom: 20px;
			}
		}

		#hide-button{
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}
</style>