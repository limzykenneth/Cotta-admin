<template>
	<article id="model-container">
		<h1>{{currentCollectionSchema.collectionName}} - {{ currentModel._uid }}</h1>

		<button
			v-on:click.prevent="renderModelForm">
			Edit
		</button>

		<button
			v-on:click.prevent="deleteModel"
		>
			Delete
		</button>

		<ul id="model-list">
			<li v-for="field in currentCollectionSchema.fields" :key="field.slug">
				<h4>{{ field.name }}</h4>

				<div class="field" v-if="field.type == 'wysiwyg'" v-html="currentModel[field.slug]"></div>
				<div class="field" v-else-if="field.type == 'text'">{{ currentModel[field.slug] }}</div>
				<div class="field" v-else-if="field.type == 'email'">{{ currentModel[field.slug] }}</div>
				<div class="field" v-else-if="field.type == 'checkbox'">
					<ul>
						<li v-for="option in currentModel[field.slug]">{{ option }}</li>
					</ul>
				</div>
				<div class="field" v-else-if="field.type == 'radio'">{{ currentModel[field.slug] }}</div>
			</li>
		</ul>
	</article>
</template>

<script>
export default {
	name: "ModelPage",
	props: {
		"currentModel": {
			type: Object,
			required: true
		},
		"currentCollectionSchema": {
			type: Object,
			required: true
		}
	},
	methods: {
		renderModelForm: function(){
			this.$emit("renderModelForm",
				this.currentCollectionSchema.collectionSlug,
				this.currentModel._uid
			);
		},
		deleteModel: function(){
			this.$emit("deleteModel",
				this.currentCollectionSchema.collectionSlug,
				this.currentModel._uid
			);
		}
	}
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

				.field{
					ul{
						.unpadded-list();
					}
				}
			}
		}
	}
</style>