const siteTitle = "Char Admin"
const url = "http://localhost:3000/api";

const Vue = require("vue");
const Vuex = require("vuex");
Vue.use(Vuex);
const urljoin = require('url-join');

var appStore = new Vuex.Store({
	state: {
		loggedIn: false,
		schemas: [],
		usersList: [],

		currentContentView: "app-dashboard",
		currentCollection: [],
		currentCollectionSchema: {},
		currentModel: {}
	},
	mutations: {
		updateSchemas: function(state, newSchemas){
			state.schemas = newSchemas;
		},
		updateUsersList: function(state, newUsersList){
			state.usersList = newUsersList;
		},
		setContentView: function(state, view){
			state.currentContentView = view;
		},
		setLoggedIn: function(state, loggedIn){
			state.loggedIn = loggedIn;
		},
		setCurrentCollection: function(state, result){
			state.currentCollection = result.collection;
			this.commit("setCurrentCollectionSchema", result.collectionSlug);
		},
		setCurrentCollectionSchema: function(state, collectionSlug){
			var selectedSchema = _.find(state.schemas, function(el){
				return el.collectionSlug == collectionSlug;
			});
			state.currentCollectionSchema = selectedSchema;
		},
		setCurrentModel: function(state, result){
			state.currentModel = result.model;
			this.commit("setCurrentCollectionSchema", result.collectionSlug);
		},
		removeModel: function(state, options){
			var collectionSlug = options.collectionSlug;
			var model = options.model;

			state.currentCollection = _.filter(state.currentCollection, function(el){
				return el._uid != model._uid;
			});
		}
	},
	actions: {
		fetchSchemas: function(context){
			var request = generateRequest("schema");
			fetch(request).then((res) => res.json()).then(function(schemas){
				if(schemas.errors && schemas.errors.length > 0){
					context.commit("setLoggedIn", false);
					context.commit("updateSchemas", []);

					_.each(schemas.errors, function(error){
						if(error.title !== "Auth Token Invalid"){
							throw new Error(error);
						}else{
							context.commit("setContentView", "login-page");
						}
					});
				}else{
					context.commit("updateSchemas", schemas);
					context.commit("setLoggedIn", true);
				}
			});
		},
		submitSchema: function(context, schema){
			var request = generateRequest("schema", "POST", schema);

			return fetch(request).then((res) => res.json()).then((schema) => {
				context.commit("setCurrentCollectionSchema", schema);
				context.state.schemas.push(schema);
				return Promise.resolve(schema);
			});
		},
		deleteSchema: function(context, collectionSlug){
			var request = generateRequest(`schema/${collectionSlug}`, "DELETE");

			return fetch(request).then((res) => res.json()).then((message) => {
				context.state.schemas = _.filter(context.state.schemas, function(el){
					return el.collectionSlug != collectionSlug;
				});
				return Promise.resolve(message);
			});
		},

		fetchUsersList: function(context){
			var request = generateRequest("users");
			fetch(request).then((res) => {
				if(res.status < 400){
					return res.json();
				}else{
					throw new Error(res);
				}
			}).then((users) => {
				context.commit("updateUsersList", users);
			}).catch((err) => {
				if(err.status == 403){
					// do nothing
				}
			});
		},
		fetchInitialData: function(context){
			context.dispatch("fetchSchemas");
			context.dispatch("fetchUsersList");
		},
		fetchCollection: function(context, collectionSlug){
			var request = generateRequest(`collections/${collectionSlug}`);
			return fetch(request).then((res) => res.json()).then((collection) => {
				context.commit("setCurrentCollection", {
					collection,
					collectionSlug
				});

				return Promise.resolve();
			});
		},
		fetchModel: function(context, options){
			var collectionSlug = options.collectionSlug;
			var uid = options.uid;
			var request = generateRequest(`collections/${collectionSlug}/${uid}`);
			return fetch(request).then((res) => res.json()).then((model) => {
				context.commit("setCurrentModel", {
					collectionSlug,
					model
				});

				return Promise.resolve();
			});
		},
		submitModel: function(context, options){
			var model = options.model;
			var collectionSlug = options.collectionSlug;
			var uid = options.uid;

			var request = generateRequest(`collections/${collectionSlug}/${uid}`, "POST", model);

			return fetch(request).then((res) => res.json()).then((model) => {
				context.commit("setCurrentModel", {
					collectionSlug,
					model
				});
				return Promise.resolve(model);
			});
		},
		deleteModel: function(context, options){
			var collectionSlug = options.collectionSlug;
			var uid = options.uid;
			var request = generateRequest(`collections/${collectionSlug}/${uid}`, "DELETE");

			return fetch(request).then((res) => res.json()).then((model) => {
				context.commit("removeModel", {
					collectionSlug,
					model
				});
				return Promise.resolve(model);
			});
		}
	}
});

var App = require("./App.vue");
App.data = function(){
	return {
		siteTitle: siteTitle,
		serverURL: url,

		contentViews: {
			dashboard: "app-dashboard",
			loginPage: "login-page",
			schemasList: "schemas-list",
			schemasEdit: "schemas-edit",
			collectionList: "collection-list",
			usersList: "users-list",
			modelPage: "model-page",
			modelEdit: "model-edit"
		},

		utils: {
			generateRequest: generateRequest
		}
	};
};

App.computed = {
	loggedIn: function(){
		return appStore.state.loggedIn;
	},
	schemas: function(){
		return appStore.state.schemas;
	},
	usersList: function(){
		return appStore.state.usersList;
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
	}
};

new Vue({
	el: "#page-content",
	store: appStore,
	render: function(h){
		appStore.dispatch("fetchUsersList");
		appStore.dispatch("fetchSchemas");
		return h(App);
	}
});

function generateRequest(path, method="GET", payload=null){
	var finalURL = urljoin(url, path);
	var token = store.get("access_token");

	var header = {};
	header["Content-Type"] = "application/json";
	if(path !== "token/generate_new_token"){
		header["Authorization"] = `Bearer ${token}`;
	}

	var body;
	if(payload !== null){
		body = JSON.stringify(payload);
	}

	var request = new Request(finalURL, {
		method: method,
		body: body,
		headers: new Headers(header)
	});

	return request;
}