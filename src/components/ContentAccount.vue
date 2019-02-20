<template>
	<article id="account-container">
		<h1>Your Account</h1>

		<h2>Change password</h2>
		<form id="change-password-form" v-on:submit.prevent="submitChangePassword">
			<div class="form-items">
				<label>Password:</label>
				<input type="password" name="password">
				<br>
				<label>New Password:</label>
				<input type="password" name="newPassword">
			</div>

			<input id="submit" type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
export default{
	name: "AccountPage",
	props: {
		"loggedInUser": {
			type: String,
			default: ""
		}
	},
	methods: {
		submitChangePassword: function(e){
			var result = this.$_formToJSON(e.target);
			result.username = this.loggedInUser;
			this.$emit("submitChangePassword", result);
		},

		// Private functions
		$_formToJSON: function(formElement){
			var result = {};

			var data = new FormData(formElement);
			for(const entry of data){
				if(result[entry[0]]){
					result[entry[0]] = Array(result[entry[0]]).concat([entry[1]]);
					// Flatten 2D array
					result[entry[0]] = result[entry[0]].reduce(
						function(a, b) {
							return a.concat(b);
						},
						[]
					);
				}else{
					result[entry[0]] = entry[1];
				}
			}
			return result;
		}
	}
};
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#account-container{
		#change-password-form{
			.simple-form-styles();
		}
	}
</style>