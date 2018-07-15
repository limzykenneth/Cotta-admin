<template>
	<article id="user-container">
		<h1>{{ currentViewUser.username }}</h1>

		<p>User role: </p>

		<p>
			User models:
			<ul id="user-models-list">
				<li class="user-model"
					v-for="(model, index) in currentViewUser.models" :key="index"
				>
					{{ model }}
				</li>
			</ul>
		</p>
	</article>
</template>

<script>
export default{
	name: "UserPage",
	props: {
		"currentViewUser": {
			type: Object,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";
</style>