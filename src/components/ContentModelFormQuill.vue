<!-- Is this accessible?? -->
<template>
	<div class="editor"
		:name="name"

		v-html="content"
	>
	</div>
</template>

<script>
let quill;

export default{
	name: "ModelFormQuill",
	props: {
		"name": {
			type: String,
			default: ""
		},
		"content": {
			type: String,
			default: ""
		}
	},
	mounted: function(){
		quill = new Quill(this.$el, {
			theme: "snow",
			placeholder: "Your text here..."
		});

		quill.on("text-change", (delta, oldDelta, source) => {
			const converter = new QuillDeltaToHtmlConverter(quill.getContents().ops, {});
			this.$emit("wysiwygChanged", converter.convert(), this.name);
		});
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

.editor{
	height: auto;
}
</style>