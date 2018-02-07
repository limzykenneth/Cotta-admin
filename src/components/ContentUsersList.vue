<template>
	<article id="users-container">
		<h1>Users</h1>

		<ul id="users-list">
			<a :href="'/users/'+user.username" class="list-items" v-for="user in usersList">
				<li>
					{{ user.username }}
				</li>
			</a>
		</ul>
	</article>
</template>

<script>
export default {
	name: "UsersList",
	props: {
		"usersList": {
			type: Array,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
@import "../mixins.less";

#users-container{
	#users-list{
		.unstyled-list();

		.list-items{
			li{
				padding: 10px;
				border: 1px solid black;
				border-top: none;
			}

			&:first-child li{
				border-top: 1px solid black;
			}
		}
	}
}
</style>