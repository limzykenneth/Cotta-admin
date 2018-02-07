<template>
	<article id="collection-container">
		<h1>{{ currentCollectionSchema.collectionName }}</h1>

		<ul id="collection-list">
			<a :href="'collections/' + currentCollectionSchema.collectionSlug + '/' + model._uid" class="list-items" v-on:click.prevent="renderModel(currentCollectionSchema.collectionSlug, model._uid)" v-for="model in currentCollection">
				<li>
					{{ model._uid }}
				</li>
			</a>
		</ul>
	</article>
</template>

<script>
export default {
	name: "CollectionList",
	props: {
		"currentCollection": {
			type: Array,
			required: true
		},
		"currentCollectionSchema": {
			type: Object,
			required: true
		}
	},
	methods: {
		renderModel: function(collectionSlug, uid){
			this.$emit("renderModel", collectionSlug, uid);
		}
	}
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#collection-container{
		#collection-list{
			.unstyled-list();

			.list-items{
				li{
					padding: 10px;
					border: 1px solid black;
					border-top: none;
				}

				&:first-child li{
					border-top: 1px solid black;
				}
			}
		}
	}
</style>