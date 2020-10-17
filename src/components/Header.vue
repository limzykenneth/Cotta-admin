<template>
	<header id="page-header">
		<span class="header-items left">{{ siteTitle }}</span>
		<span class="spacer"></span>
		<a href="/account" v-if="loggedIn" v-on:click.prevent="renderAccount">
			<span class="header-items right">Account</span>
		</a>
		<a href="/logout" v-if="loggedIn" v-on:click.prevent="logoutUser">
			<span class="header-items right">Logout</span>
		</a>
		<a href="/login" v-else v-on:click.prevent="renderLogin">
			<span class="header-items right">Login</span>
		</a>
	</header>
</template>

<script>
export default {
	name: "AppHeader",
	computed: {
		loggedIn: function(){
			return this.$store.state.loggedIn;
		},
		siteTitle: function(){
			return this.$store.state.siteTitle;
		}
	},
	methods: {
		renderLogin: function(){
			this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
		},
		logoutUser: function(){
			store.remove("access_token");
			this.$store.commit("updateSchemas", []);
			this.$store.commit("setLoggedIn", false);
			this.$store.commit("updateUsersList", []);
			this.$store.commit("setLoggedInUser", "");
			this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
		},
		renderAccount: function(){
			this.$store.commit("setContentView", this.$store.state.contentViews.accountPage);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

#page-header{
	.subtitle-font();

	background: #000;
	color: #fff;

	width: 100vw;
	height: 50px;

	padding-left: 1rem;
	padding-right: 1rem;

	display: flex;
	align-items: center;

	.spacer{
		flex-grow: 2;
	}

	.header-items{
		padding-left: 1rem;

		&:first-child{
			padding-left: 0rem;
			padding-right: 1rem;
		}
	}
}

.left{
	float: left;
}

.right{
	float: right;
}
</style>