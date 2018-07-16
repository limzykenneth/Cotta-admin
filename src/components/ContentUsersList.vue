<template>
	<article id="users-container">
		<h1>Users</h1>
		<button v-on:click.prevent="renderUserForm('')">New</button>

		<ul id="users-list">
			<users-list-item
				v-for="user in usersList" :key="user.username"
				:user="user"

				v-on:renderUser="renderUser"
				v-on:renderUserForm="renderUserForm"
				v-on:deleteUser="deleteUser"
			></users-list-item>
		</ul>
	</article>
</template>

<script>
import UsersListItem from "./ContentUsersListItem.vue";

export default {
	name: "UsersList",
	props: {
		"usersList": {
			type: Array,
			required: true
		}
	},
	components: {
		"users-list-item": UsersListItem
	},
	methods:{
		renderUser: function(username){
			this.$emit("renderUser", username);
		},
		renderUserForm: function(username){
			this.$emit("renderUserForm", username);
		},
		deleteUser: function(username){
			this.$emit("deleteUser", username)
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