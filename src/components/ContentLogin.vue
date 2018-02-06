<template>
	<article id="login-container">
		<h1>Login</h1>

		<form v-on:submit.prevent="loginUser">
			<input id="username" type="text" name="username" placeholder="Username">
			<input id="password" type="password" name="password" placeholder="Password">
			<input type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
export default {
	name: "LoginPage",
	methods: {
		loginUser: function(e){
			var username = e.target.querySelector("#username").value;
			var password = e.target.querySelector("#password").value;

			this.$emit("loginUser", {
				username: username,
				password: password
			});
		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";

#login-container{
	position: relative;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: block;
	text-align: center;
	width: 200px;

	form{
		display: inline-block;

		input{
			display: inline-block;
			margin-bottom: 10px;
		}
	}
}
</style>