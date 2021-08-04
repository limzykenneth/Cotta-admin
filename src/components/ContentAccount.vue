<template>
	<article id="account-container">
		<h1>Your Account</h1>

		<h2>Change password</h2>
		<form id="change-password-form" v-on:submit.prevent="submitChangePassword">
			<div class="form-items">
				<label>Password:</label>
				<input type="password" name="password"
					v-model="changePassword.password"
				>
				<br>
				<label>New Password:</label>
				<input type="password" name="newPassword"
					v-model="changePassword.newPassword"
				>
			</div>

			<input id="submit" type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
export default{
	name: "AccountPage",
	data: function(){
		return {
			changePassword: {
				password: "",
				newPassword: ""
			}
		};
	},
	computed: {
		loggedInUser: function(){
			return this.$store.state.loggedInUser;
		}
	},
	methods: {
		submitChangePassword: async function(e){
			const result = {
				username: this.loggedInUser,
				password: this.changePassword.password,
				newPassword: this.changePassword.newPassword
			};

			try{
				const res = await this.$store.dispatch("submitChangePassword", result);
				this.$store.commit("setContentView", this.$store.state.contentViews.dashboard);
				this.$store.commit("setToastMessage", res.message);
			}catch(err){
				this.$store.commit("setToastMessage", err.detail);
			}
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../assets/stylesheets/mixins.less";

	#account-container{
		#change-password-form{
			.simple-form-styles();
		}
	}
</style>