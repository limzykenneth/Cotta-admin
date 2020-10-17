<template>
	<section id="page-toast">
		<span id="toast-message">{{ toastMessage }}</span>
	</section>
</template>

<script>
export default {
	name: "AppToast",
	computed: {
		toastMessage: function(){
			return this.$store.state.toastMessage;
		}
	},
	watch: {
		toastMessage: function(message){
			if(message.trim() !== ""){
				popToast.call(this);
			}
		}
	}
};

let timerPersist, timerFade;
function popToast(){
	clearTimeout(timerPersist);
	clearTimeout(timerFade);

	this.$el.style.display = "block";
	_.defer(() => {
		this.$el.style.opacity = 1;
	});

	timerPersist = setTimeout(() => {

		this.$el.style.opacity = 0;
		timerFade = setTimeout(() => {
			this.$el.style.display = "none";
			this.$store.commit("setToastMessage", "");
		}, 500);

	}, 3000);
}
</script>

<style lang="less" scoped>
@import "../assets/stylesheets/mixins.less";

@background-color: #FFF5D4;
#page-toast{
	position: fixed;
	bottom: 0rem;
	left: 0;
	right: 0;
	padding: 1rem;
	margin: 1rem;
	background-color: @background-color;
	display: none;
	opacity: 0;
	transition: opacity 0.5s ease;
	z-index: 1000;
}
</style>