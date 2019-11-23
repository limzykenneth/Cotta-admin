//---------------------------------------------//
//               Dependencies                  //
//---------------------------------------------//
import Vue from "vue/dist/vue.esm.browser";
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

/**
 * Computed properties controlled by Vuex
 */
App.computed = {
	toastMessage: function(){
		return appStore.state.toastMessage;
	},
	loggedIn: function(){
		return appStore.state.loggedIn;
	},
	loggedInUser: function(){
		return appStore.state.loggedInUser;
	},
	schemas: function(){
		return appStore.state.schemas;
	},
	usersList: function(){
		return appStore.state.usersList;
	},
	currentViewUser: function(){
		return appStore.state.currentViewUser;
	},
	currentContentView: function(){
		return appStore.state.currentContentView;
	},
	currentCollection: function(){
		return appStore.state.currentCollection;
	},
	currentCollectionSchema: function(){
		return appStore.state.currentCollectionSchema;
	},
	currentModel: function(){
		return appStore.state.currentModel;
	},
	configurations: function(){
		return appStore.state.configurations;
	},
	files: function(){
		return appStore.state.files;
	}
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