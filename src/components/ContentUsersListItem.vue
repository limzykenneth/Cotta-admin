<template>
	<li class="user-container"
		v-on:click.prevent="renderUser(user.username)"
	>
		<span class="collection-name">{{ user.username }}</span>
		<button class="edit-button" v-on:click.prevent.stop="renderUserForm">Edit</button>
		<button class="delete-button" v-on:click.prevent.stop="deleteUser">Delete</button>
	</li>
</template>

<script>
export default {
	name: "UserListItem",
	props: {
		"user": {
			type: Object,
			required: true
		}
	},
	methods: {
		renderUser: function(username){
			this.$emit("renderUser", username);
		},
		renderUserForm: function(){
			this.$emit("renderUserForm", this.user.username);
		},
		deleteUser: function(){
			this.$emit("deleteUser", this.user.username);
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	.user-container{
		.list-item();
	}
</style>