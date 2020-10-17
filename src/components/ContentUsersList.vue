<template>
	<article id="users-container">
		<h1>Users</h1>
		<button id="new-button" v-on:click.prevent="renderUserForm">New</button>

		<ul id="users-list">
			<users-list-item
				v-for="user in usersList" :key="user.username"
				:user="user"
			></users-list-item>
		</ul>
	</article>
</template>

<script>
import UsersListItem from "./ContentUsersListItem.vue";

export default {
	name: "UsersList",
	components: {
		"users-list-item": UsersListItem
	},
	props: {
		"usersList": {
			type: Array,
			required: true
		}
	},
	methods:{
		renderUserForm: function(username){
			this.$store.commit("setCurrentViewUser", {});
			this.$store.commit("setContentView", this.$store.state.contentViews.userEdit);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

#users-container{
	#new-button{
		margin-bottom: 0.5rem;
	}

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