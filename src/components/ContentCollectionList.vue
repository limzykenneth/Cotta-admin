<template>
	<article id="collection-container">
		<h1>{{ currentCollectionSchema.tableName }}</h1>

		<button id="new-button" v-on:click.prevent="renderModelForm">New</button>

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
	computed: {
		currentCollection: function(){
			return this.$store.state.currentCollection;
		},
		currentCollectionSchema: function(){
			return this.$store.state.currentCollectionSchema;
		}
	},
	methods: {
		renderModel: function(tableSlug, uid){
			this.$store.dispatch("fetchModel", {
				tableSlug,
				uid
			}).then((model) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.modelPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderModelForm: function(){
			this.$store.dispatch("fetchCollection", this.currentCollectionSchema.tableSlug).then((collection) => {
				this.$store.commit("setCurrentModel", {
					model: {},
					tableSlug: this.currentCollectionSchema.tableSlug
				});
				this.$store.commit("setContentView", this.$store.state.contentViews.modelEdit);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
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