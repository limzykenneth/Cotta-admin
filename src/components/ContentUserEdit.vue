<template>
	<article id="user-form-container">
		<h1 v-if="currentViewUser.role">User</h1>
		<h1 v-if="currentViewUser.role == undefined">New User</h1>

		<form id="user-form" v-on:submit.prevent="submitUser">
			<div class="form-items">
				<label>Username:</label>
				<input type="text" name="username" required
					:value="currentViewUser.username"
				>
				<br>

				<label v-if="currentViewUser.role">Role:</label>
				<input v-if="currentViewUser.role"
					type="text" name="role" required
					:value="currentViewUser.role"
				>

				<label v-if="currentViewUser.role == undefined">Password:</label>
				<input v-if="currentViewUser.role == undefined"
					type="password" name="password" required
				>
			</div>

			<input id="submit" type="submit" name="submit" value="Submit">
		</form>
	</article>
</template>

<script>
export default{
	name: "UserEdit",
	props: {
		"currentViewUser": {
			type: Object,
			default: function(){
				return {};
			}
		}
	},
	methods: {
		submitUser: function(e){
			const result = this.$_formToJSON(e.target);

			this.$store.dispatch("submitUser", result).then((res) => {
				this.$store.commit("setContentView", this.$store.state.contentViews.dashboard);
				this.$store.commit("setToastMessage", res.message);
			}).catch((err) => {
				this.$store.commit("setToastMessage", err.detail);
			});
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
@import "../assets/stylesheets/mixins.less";

#user-form-container{
	#user-form{
		.simple-form-styles();
	}
}
</style>