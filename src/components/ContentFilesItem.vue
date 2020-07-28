<template>
	<article class="file-item">
		<h2 class="file-name">{{ file.file_name }}</h2>

		<div class="file-thumbnail-container">
			<img class="file-thumbnail"
				v-if="file['content-type'].startsWith('image/')"
				:src="file.file_permalink"
			>
		</div>
	</article>
</template>

<script>
export default {
	name: "FilesItem",
	props: {
		"file": {
			type: Object,
			required: true
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	.file-item {
		width: 200px;
		height: 200px;
		border: 1px solid black;
		padding: 10px;
		margin: 1px;
		cursor: pointer;

		.file-name {
			font-size: 1em;
			margin: 0.25em 0;
		}

		.file-thumbnail-container{
			width: 100%;
			height: ~"calc(100% - 1.25em - 10px)";
			text-align: center;

			.file-thumbnail{
				display: inline-block;
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
</style>