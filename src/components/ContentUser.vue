<template>
	<article id="user-container">
		<h1>{{ currentViewUser.username }}</h1>

		<p>User role: {{ currentViewUser.role }}</p>

		<p>
			User models:
			<ul id="user-models-list">
				<a class="list-items"
					v-for="(model, index) in currentViewUser.models" :key="index"
					:href="userModelLinks[index].link"
					v-on:click.prevent="renderModel(userModelLinks[index].tableSlug, userModelLinks[index].modelID)"
				>
					<li >
						{{ model }}
					</li>
				</a>
			</ul>
		</p>
	</article>
</template>

<script>
export default{
	name: "UserPage",
	computed: {
		currentViewUser: function(){
			return this.$store.state.currentViewUser;
		},
		userModelLinks: function(){
			let models = [];
			_.each(this.currentViewUser.models, (model, i) => {
				let modelPaths = model.split(".");
				let tableSlug = modelPaths[0];
				let modelID = modelPaths[1];
				let link = `collections/${tableSlug}/${modelID}`;
				models.push({
					tableSlug,
					modelID,
					link
				});
			});

			return models;
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
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#user-container{
		#user-models-list{
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