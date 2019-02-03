<template>
	<article id="login-container">
		<h1>Login</h1>

		<div id="message">{{ loginMessage }}</div>

		<form v-on:submit.prevent="loginUser">
			<input id="username" type="text" name="username" placeholder="Username" required>
			<input id="password" type="password" name="password" placeholder="Password" required>
			<input type="submit" name="submit" value="Submit">
		</form>

		<hr>

		<p id="signup">
			Don't have an account? <a href="/signup"
				v-on:click.prevent="renderSignup"
			>Sign Up</a>
		</p>
	</article>
</template>

<script>
export default {
	name: "LoginPage",
	props: {
		"loginMessage":{
			type: String,
			default: ""
		}
	},
	methods: {
		loginUser: function(e){
			var username = e.target.querySelector("#username").value;
			var password = e.target.querySelector("#password").value;

			this.$emit("loginUser", {
				username: username,
				password: password
			});
		},
		renderSignup: function(){
			this.$emit("renderSignup");
		}
	}
};
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

	#signup{
		text-align: left;
	}

	#message{
		color: #f00;
	}
}
</style>