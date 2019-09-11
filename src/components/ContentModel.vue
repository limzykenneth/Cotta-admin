<template>
	<article id="model-container">
		<h1>{{currentCollectionSchema.tableName}} - {{ currentModel._uid }}</h1>

		<button
			v-on:click.prevent="renderModelForm">
			Edit
		</button>

		<button class="delete-button"
			v-on:click.prevent="deleteModel"
		>
			Delete
		</button>

		<ul id="model-list">
			<li v-for="(field, key, index) in currentCollectionSchema.definition" :key="key">
				<h4>{{ field.app_title }}</h4>

				<div class="field" v-if="field.app_type == 'wysiwyg'" v-html="currentModel[key]"></div>

				<div class="field" v-else-if="field.app_type == 'text'">{{ currentModel[key] }}</div>

				<div class="field" v-else-if="field.app_type == 'email'">{{ currentModel[key] }}</div>

				<div class="field" v-else-if="field.app_type == 'checkbox'">
					<ul>
						<li v-for="option in currentModel[key]">{{ option }}</li>
					</ul>
				</div>

				<div class="field" v-else-if="field.app_type == 'radio'">{{ currentModel[key] }}</div>

				<div class="field" v-else-if="field.app_type == 'file'">
					<img class="field-image" v-bind:src="currentModel[key].permalink">
				</div>
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
				this.currentCollectionSchema.tableSlug,
				this.currentModel._uid
			);
		},
		deleteModel: function(){
			this.$emit("deleteModel",
				this.currentCollectionSchema.tableSlug,
				this.currentModel._uid
			);
		}
	}
};
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

					.field-image{
						max-width: ~"calc((100vw - 220px) * 0.8)";
					}
				}
			}
		}
	}
</style>