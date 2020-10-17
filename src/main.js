//---------------------------------------------//
//               Dependencies                  //
//---------------------------------------------//
import Vue from "vue";
import {appTokenValid} from "./utils.js";

//---------------------------------------------//
//            App storage (Vuex)               //
//---------------------------------------------//
import appStore from "./storage.js";

//---------------------------------------------//
//            App initialization               //
//---------------------------------------------//
import App from "./App.vue";

/**
 * Starting point of the Vue app
 */
new Vue({
	el: "#page-content",
	store: appStore,
	render: function(createElement){
		if(appTokenValid()){
			this.$store.dispatch("fetchUsersList");
			this.$store.dispatch("fetchSchemas");
		}else{
			this.$store.commit("setContentView", "login-page");
		}
		return createElement(App);
	}
});