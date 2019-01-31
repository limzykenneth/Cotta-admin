//---------------------------------------------//
//               App constants                 //
//---------------------------------------------//
const siteTitle = "Char Admin";
const url = "http://localhost:3000/api";

//---------------------------------------------//
//               Dependencies                  //
//---------------------------------------------//
const Vue = require("vue");
const Vuex = require("vuex");
Vue.use(Vuex);
const urlJoin = require("url-join");

//---------------------------------------------//
//            App storage (Vuex)               //
//---------------------------------------------//
/**
 * Vuex store initialization
 */
const appStore = new Vuex.Store({
	/**
	 * Vuex store states initialization.
	 */
	state: {
		loggedIn: false,
		schemas: [],
		usersList: [],

		currentContentView: "app-dashboard",
		currentCollection: [],
		currentCollectionSchema: {},
		currentModel: {},
		currentViewUser: {}
	},
	/**
	 * Vuex store mutations. Used to modify Vuex store states.
	 */
	mutations: {
		updateSchemas: function(state, newSchemas){
			state.schemas = newSchemas;
		},
		addNewEditSchema: function(state, schema){
			var matchedSchemaIndex = _.findIndex(state.schemas, function(el){
				return el.collectionSlug == schema.collectionSlug;
			});
			if(matchedSchemaIndex > -1){
				state.schemas[matchedSchemaIndex] = schema;
			}else{
				state.schemas.push(schema);
			}
		},
		removeSchema: function(state, collectionSlug){
			state.schemas = _.filter(state.schemas, function(el){
				return el.collectionSlug != collectionSlug;
			});
		},
		updateUsersList: function(state, newUsersList){
			state.usersList = newUsersList;
		},
		setCurrentViewUser: function(state, currentViewUser){
			state.currentViewUser = currentViewUser;
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

			if(!model){
				throw Error("No valid model defined");
			}

			state.currentCollection = _.filter(state.currentCollection, function(el){
				return el._uid != model._uid;
			});
		}
	},
	/**
	 * Vuex store actions. Used make asynchronous calls to the server and
	 * update the Vuex store by calling Vuex mutations.
	 */
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
				context.commit("addNewEditSchema", schema);
				return Promise.resolve(schema);
			});
		},
		deleteSchema: function(context, collectionSlug){
			var request = generateRequest(`schema/${collectionSlug}`, "DELETE");

			return fetch(request).then((res) => res.json()).then((message) => {
				context.commit("removeSchema", collectionSlug);
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
		},

		fetchUser: function(context, username){
			var request = generateRequest(`users/${username}`);

			return fetch(request).then((res) => res.json()).then((user) => {
				return Promise.resolve(user);
			});
		},
		deleteUser: function(context, username){
			var request = generateRequest(`users/${username}`, "DELETE");

			return fetch(request).then((res) => res.json()).then((message) => {
				return Promise.resolve(message);
			});
		}
	}
});

//---------------------------------------------//
//            App initialization               //
//---------------------------------------------//
/**
 * Initialize Vue app and register data
 */
const App = require("./App.vue");
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
			modelEdit: "model-edit"
		},

		utils: {
			generateRequest: generateRequest,
			urlJoin: urlJoin
		}
	};
};

/**
 * Computed properties controlled by Vuex
 */
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
	render: function(h){
		appStore.dispatch("fetchUsersList");
		appStore.dispatch("fetchSchemas");
		return h(App);
	}
});

//---------------------------------------------//
//                  Utils                      //
//---------------------------------------------//
/**
 * Generate `request` object to be passed to `fetch` that is populated with all
 * the necessary headers. Also automatically stringify payload body.
 */
function generateRequest(path, method="GET", payload=null){
	var finalURL = urlJoin(url, path);
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