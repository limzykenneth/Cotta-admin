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
			this.$store.dispatch("fetchUser", username).then((user) => {
				this.$store.commit("setCurrentViewUser", user);
				this.$store.commit("setContentView", this.$store.state.contentViews.userPage);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderUserForm: function(){
			this.$store.dispatch("fetchUser", this.user.username).then((user) => {
				this.$store.commit("setCurrentViewUser", user);
				this.$store.commit("setContentView", this.$store.state.contentViews.userEdit);
			});
		},
		deleteUser: function(){
			this.$store.dispatch("deleteUser", this.user.username).then((res) => {
				this.$store.commit("setToastMessage", res.message);
				this.$store.dispatch("fetchUsersList").catch((err) => {
					this.$store.commit("setToastMessage", err.detail);
				});
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
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