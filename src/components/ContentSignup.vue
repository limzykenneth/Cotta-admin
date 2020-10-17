<template>
	<article id="signup-container">
		<h1>Sign Up</h1>

		<div id="message"></div>

		<form v-on:submit.prevent="signupUser">
			<input id="username" type="text" name="username" placeholder="Username" required>
			<input id="password" type="password" name="password" placeholder="Password" required>
			<input id="confirm-password" type="password" name="confirm-password" placeholder="Confirm Password" required>
			<input type="submit" name="submit" value="Submit">
		</form>

		<hr>

		<p>Have an account? <a href="/login"
			v-on:click.prevent="renderLogin"
		>Login</a></p>
	</article>
</template>

<script>
export default {
	name: "SignupPage",
	methods: {
		signupUser: function(e){
			const username = e.target.querySelector("#username").value;
			const password = e.target.querySelector("#password").value;
			const confirmPassword = e.target.querySelector("#confirm-password").value;

			if(password !== confirmPassword){
				this.$el.querySelector("#message").innerHTML = "Passwords don't match";
				return;
			}else{
				this.$el.querySelector("#message").innerHTML = "";
			}

			this.$store.dispatch("signupUser", {username, password}).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
				this.$store.commit("setToastMessage", "You have sucessfully signed up!");
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
		},
		renderLogin: function(){
			this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

#signup-container{
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

	#message{
		color: #f00;
	}
}
</style>