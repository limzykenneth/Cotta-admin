<template>
	<article id="model-container">
		<h1>{{ currentModel._uid }}</h1>

		<ul id="model-list">
			<li v-for="field in currentCollectionSchema.fields">
				<h4>{{ field.name }}</h4>

				<div v-if="field.type == 'wysiwyg'" v-html="currentModel[field.slug]"></div>
				<div v-else-if="field.type == 'text'">{{ currentModel[field.slug] }}</div>
				<div v-else-if="field.type == 'email'">{{ currentModel[field.slug] }}</div>
				<div v-else-if="field.type == 'checkbox'">
					<ul>
						<li v-for="option in currentModel[field.slug]">{{ option }}</li>
					</ul>
				</div>
				<div v-else-if="field.type == 'radio'">{{ currentModel[field.slug] }}</div>
			</li>
		</ul>
	</article>
</template>

<script>
export default {
	name: "model",
	props: [
		"currentModel",
		"currentCollectionSchema"
	]
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#model-container{
		max-width: ~"calc(100vw - 220px)";

		#model-list{
			.unstyled-list();

			li{
				margin-bottom: 1rem;
			}
		}
	}
</style>