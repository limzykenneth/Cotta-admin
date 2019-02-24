<template>
	<div class="multi-choice">
		<span>Choice {{ index }}: </span>
		<input class="choice-label choice-input" type="text" placeholder="Label" name="choice-label"
			v-model="choice.label"
			v-on:input="choiceChanged"
		>
		<input class="choice-value choice-input" type="text" placeholder="Value" name="choice-value"
			v-model="choice.value"
			v-on:input="choiceChanged"
		>
		<button
			v-if="showRemove"
			v-on:click.prevent="removeChoice"
		>Remove</button>
	</div>
</template>

<script>
export default {
	name: "SchemasEditFieldMultiChoice",
	props: {
		"choice": {
			type: Object,
			default: () => {
				return {
					label: "",
					value: ""
				};
			}
		},
		"index": {
			type: Number,
			default: 0
		},
		"showRemove": {
			type: Boolean,
			default: false
		}
	},
	methods: {
		removeChoice: function(){
			this.$emit("removeChoice", this.index);
		},
		choiceChanged: function(){
			this.$emit("choiceChanged", {
				choice: this.choice,
				index: this.index
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import "../mixins.less";

.multi-choice{
	.choice-input{
		width: 200px;
	}
}
</style>