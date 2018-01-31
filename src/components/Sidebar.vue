<template>
	<section id="page-sidebar">
		<ul class="lists admin-list">
			<a href="/" v-on:click.prevent="renderDashboard"><li>Dashboard</li></a>
			<a href="schemas" v-on:click.prevent="renderSchemasList"><li>Schemas</li></a>
			<a href="users"><li>Users</li></a>
			<a href="settings"><li>Settings</li></a>
			<li class="spacer"></li>
		</ul>
		<ul class="lists schema-list">
			<a v-for="schema in schemas" v-bind:href="schema.collectionSlug" v-on:click.prevent="renderCollection(schema.collectionSlug)">
				<li>{{ schema.collectionName }}</li>
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

	.lists{
		.body-font();

		list-style: none;
		padding: 0;
		margin: 0;

		li{
			width: 100%;
			padding: 10px 20px;

			&:hover{
				background-color: lighten(@background-color, 10%);
			}

			&.spacer:hover{
				background-color: initial;
			}
		}

		&.schema-list{

		}

		&.admin-list{

		}
	}
}
</style>