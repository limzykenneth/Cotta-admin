<template>
	<section id="page-sidebar" v-if="loggedIn">
		<ul class="lists admin-list">
			<a href="/" v-on:click.prevent="renderDashboard"><li>
				<i class="fa fa-tachometer" aria-hidden="true"></i>Dashboard
			</li></a>
			<a href="schemas" v-on:click.prevent="renderSchemasList"><li>
				<i class="fa fa-table" aria-hidden="true"></i>Schemas
			</li></a>
			<a href="files" v-on:click.prevent="renderFilesList"><li>
				<i class="fa fa-picture-o" aria-hidden="true"></i>Files
			</li></a>
			<a href="users" v-on:click.prevent="renderUsersList"><li>
				<i class="fa fa-users" aria-hidden="true"></i>Users
			</li></a>
			<a href="settings" v-on:click.prevent="renderSettings"><li>
				<i class="fa fa-cog" aria-hidden="true"></i>Settings
			</li></a>
			<li class="spacer"></li>
		</ul>
		<ul class="lists schema-list">
			<h4 class="list-section-title">Collections</h4>
			<a v-for="schema in schemas" :key="schema.tableSlug"
				:href="schema.tableSlug"
				v-on:click.prevent="renderCollection(schema.tableSlug)"
			>
				<li><i class="fa fa-file" aria-hidden="true"></i>{{ schema.tableName }}</li>
			</a>
		</ul>
	</section>
</template>

<script>
export default {
	name: "AppSidebar",
	computed: {
		schemas: function(){
			return this.$store.state.schemas;
		},
		loggedIn: function(){
			return this.$store.state.loggedIn;
		}
	},
	methods: {
		renderDashboard: function(e){
			this.$store.commit("setContentView", this.$store.state.contentViews.dashboard);
		},
		renderSchemasList: function(e){
			this.$store.commit("setContentView", this.$store.state.contentViews.schemasList);
		},
		renderCollection: function(tableSlug){
			this.$store.dispatch("fetchCollection", tableSlug).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.collectionList);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderUsersList: function(){
			this.$store.dispatch("fetchUsersList").then(() => {
				this.$store.commit("setContentView", this.$store.state.contentViews.usersList);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderSettings: function(){
			this.$store.dispatch("fetchConfigurations").then((res) => {
				this.$store.commit("setConfigurations", res);
				this.$store.commit("setContentView", this.$store.state.contentViews.settingsPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderFilesList: function(){
			this.$store.dispatch("fetchFiles").then((res) => {
				this.$store.commit("setFiles", res);
				this.$store.commit("setContentView", this.$store.state.contentViews.filesPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

@background-color: #8888ff;
#page-sidebar{
	background: @background-color;
	width: 200px;
	height: 100%;
	padding-top: 10px;
	overflow-y: scroll;

	.lists{
		.body-font();

		list-style: none;
		padding: 0;
		margin: 0;

		.list-section-title{
			margin: 10px 0;
			padding: 0 20px;
			color: rgba(0,0,0,0.5);
		}

		li{
			width: 100%;
			padding: 10px 20px;

			&:hover{
				background-color: lighten(@background-color, 10%);
			}

			&.spacer:hover{
				background-color: initial;
			}

			.fa{
				text-align: center;
				width: 1rem;
				margin-right: 15px;
			}
		}

		&.schema-list{

		}

		&.admin-list{

		}
	}
}
</style>