<template>
	<section id="page-sidebar">
		<ul class="lists admin-list">
			<a href="/" v-on:click.prevent="renderDashboard"><li>
				<i class="fa fa-tachometer" aria-hidden="true"></i>Dashboard
			</li></a>
			<a href="schemas" v-on:click.prevent="renderSchemasList"><li>
				<i class="fa fa-table" aria-hidden="true"></i>Schemas
			</li></a>
			<a href="users"><li>
				<i class="fa fa-users" aria-hidden="true"></i>Users
			</li></a>
			<a href="settings"><li>
				<i class="fa fa-cog" aria-hidden="true"></i>Settings
			</li></a>
			<li class="spacer"></li>
		</ul>
		<ul class="lists schema-list">
			<h4 class="list-section-title">Collections</h4>
			<a v-for="schema in schemas" v-bind:href="schema.collectionSlug" v-on:click.prevent="renderCollection(schema.collectionSlug)">
				<li><i class="fa fa-file" aria-hidden="true"></i>{{ schema.collectionName }}</li>
			</a>
		</ul>
	</section>
</template>

<script>
export default {
	name: "sidebar",
	props: ["schemas"],
	methods: {
		renderDashboard: function(e){
			this.$emit("renderDashboard")
		},
		renderSchemasList: function(e){
			this.$emit("renderSchemasList");
		},
		renderCollection: function(collectionSlug){
			this.$emit("renderCollection", collectionSlug);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

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