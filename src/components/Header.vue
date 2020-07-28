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
	props: {
		"siteTitle": {
			type: String,
			required: true
		},
		"loggedIn": {
			type: Boolean,
			default: false
		}
	},
	methods: {
		renderLogin: function(){
			this.$emit("renderLogin");
		},
		logoutUser: function(){
			this.$emit("logoutUser");
			this.$emit("renderLogin");
		},
		renderAccount: function(){
			this.$emit("renderAccount");
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