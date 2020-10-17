//---------------------------------------------//
//               Dependencies                  //
//---------------------------------------------//
import Vue from "vue";
import urlJoin from "url-join";
import {url, siteTitle, generateRequest, appTokenValid} from "./utils.js";

//---------------------------------------------//
//            App storage (Vuex)               //
//---------------------------------------------//
import appStore from "./storage.js";

//---------------------------------------------//
//            App initialization               //
//---------------------------------------------//
/**
 * Initialize Vue app and register data
 */
import App from "./App.vue";
App.data = function(){
	return {
		siteTitle: siteTitle,
		serverURL: url,

		contentViews: {
			dashboard: "app-dashboard",
			loginPage: "login-page",
			signupPage: "signup-page",
			schemasList: "schemas-list",
			schemasEdit: "schemas-edit",
			collectionList: "collection-list",
			usersList: "users-list",
			userEdit: "user-edit",
			userPage: "user-page",
			modelPage: "model-page",
			modelEdit: "model-edit",
			accountPage: "account-page",
			settingsPage: "settings-page",
			filesPage: "files-page"
		},

		utils: {
			generateRequest: generateRequest,
			urlJoin: urlJoin,
			appTokenValid: appTokenValid
		}
	};
};

//---------------------------------------------//
//              Start the app!                 //
//---------------------------------------------//
/**
 * Starting point of the Vue app
 */
new Vue({
	el: "#page-content",
	store: appStore,
	render: function(createElement){
		if(appTokenValid()){
			appStore.dispatch("fetchUsersList");
			appStore.dispatch("fetchSchemas");
		}else{
			appStore.commit("setContentView", "login-page");
		}
		return createElement(App);
	}
});