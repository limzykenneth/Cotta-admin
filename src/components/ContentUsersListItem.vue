<template>
	<li class="user-container"
		v-on:click.prevent="renderUser(user.username)"
	>
		{{ user.username }}
		<button v-on:click.prevent.stop="renderUserForm">Edit</button>
		<button v-on:click.prevent.stop="deleteUser">Delete</button>
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
	@import "../mixins.less";

	.user-container{
		border: 1px solid black;
		padding: 10px;
		margin-bottom: 10px;
		cursor: pointer;
	}
</style>