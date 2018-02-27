<template>
	<article id="users-container">
		<h1>Users</h1>

		<ul id="users-list">
			<a class="list-items"
				:href="'/users/'+user.username"
				v-for="user in usersList" :key="user.username"
				v-on:click.prevent="renderUser"
			>
				<li>
					{{ user.username }}
				</li>
			</a>
		</ul>
	</article>
</template>

<script>
export default {
	name: "UsersList",
	props: {
		"usersList": {
			type: Array,
			required: true
		}
	},
	methods:{
		renderUser: function(){

		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";

#users-container{
	#users-list{
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