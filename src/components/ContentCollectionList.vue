<template>
	<article id="collection-container">
		<h1>{{ currentCollectionSchema.collectionName }}</h1>

		<ul id="collection-list">
			<a href="" class="list-items" v-for="model in currentCollection"><li>
				{{ model._uid }}
			</li></a>
		</ul>
	</article>
</template>

<script>
export default {
	name: "collection-list",
	props: [
		"currentCollection",
		"currentCollectionSchema"
	]
}
</script>

<style lang="less" scoped>
	@import "../mixins.less";

	#collection-container{
		#collection-list{
			list-style: none;
			margin: 0;
			padding: 0;

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