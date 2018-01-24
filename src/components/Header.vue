<template>
	<header id="page-header">
		<span class="header-items left">{{ siteTitle }}</span>
		<span class="spacer"></span>
		<span class="header-items right">Account</span>
		<span class="header-items right">Logout</span>
	</header>
</template>

<script>
export default {
	name: "header",
	props: ["site-title"]
};
</script>

<style lang="less" scoped>
#page-header{
	background: #000;
	color: #fff;

	width: 100vw;
	height: 5vh;

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