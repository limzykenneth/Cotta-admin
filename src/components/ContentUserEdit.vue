<template>
	<article id="user-form-container">
		<h1>User</h1>

		<form id="user-form" v-on:submit.prevent="submitUser">
			<div>
				<label>Username:</label>
				<input type="text" name="username" :value="currentViewUser.username">
				<br>
				<label>Role:</label>
				<input type="text" name="role" :value="currentViewUser.role">
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
			type: Object
		}
	},
	methods: {
		submitUser: function(e){
			var result = this.$_formToJSON(e.target);
			this.$emit("submitUser", result);
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
}
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>