<template>
	<article id="collection-container">
		<h1>{{ currentCollectionSchema.tableName }}</h1>

		<button id="new-button" v-on:click.prevent="renderModelForm(currentCollectionSchema.tableSlug)">New</button>

		<ul id="collection-list">
			<a class="list-items"
				:href="'collections/' + currentCollectionSchema.tableSlug + '/' + model._uid"
				v-on:click.prevent="renderModel(currentCollectionSchema.tableSlug, model._uid)"
				v-for="model in currentCollection" :key="model._uid"
			>
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
		renderModel: function(tableSlug, uid){
			this.$emit("renderModel", tableSlug, uid);
		},
		renderModelForm: function(tableSlug){
			this.$emit("renderModelForm", tableSlug);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#collection-container{
		#new-button{
			margin-bottom: 0.5rem;
		}

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