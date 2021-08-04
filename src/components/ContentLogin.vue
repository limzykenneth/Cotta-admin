<template>
	<article id="login-container">
		<h1>Login</h1>

		<form v-on:submit.prevent="loginUser">
			<input id="username" type="text" name="username" placeholder="Username" required
				v-model="username"
			>
			<input id="password" type="password" name="password" placeholder="Password" required
				v-model="password"
			>
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
	data: function(){
		return {
			username: "",
			password: ""
		};
	},
	methods: {
		loginUser: async function(e){
			const username = this.username;
			const password = this.password;

			try{
				await this.$store.dispatch("loginUser", {username, password});
				this.$store.commit("setContentView", this.$store.state.contentViews.dashboard);
			}catch(err) {
				if(err.title === "Authentication Failed"){
					this.$store.commit("setContentView", this.$store.state.contentViews.loginPage);
				}else{
					console.error(err);
				}
				this.$store.commit("setToastMessage", err.detail);
			}
		},
		renderSignup: function(){
			this.$store.commit("setContentView", this.$store.state.contentViews.signupPage);
		}
	}
};
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

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
}
</style>