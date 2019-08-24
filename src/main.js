//---------------------------------------------//
//               App constants                 //
//---------------------------------------------//
const siteTitle = "Char Admin";
const url = "http://localhost:3000/api";

//---------------------------------------------//
//               Dependencies                  //
//---------------------------------------------//
import Vue from "vue/dist/vue.esm.browser";
import Vuex from "vuex/dist/vuex.js";
Vue.use(Vuex);
import urlJoin from "url-join";
import jwtDecode from "jwt-decode";

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
		toastMessage: "",

		loggedIn: false,
		loggedInUser: "",
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
		setToastMessage: function(state, message){
			if(message === state.toastMessage && message.trim() !== ""){
				state.toastMessage = "";
				_.defer(() => {
					state.toastMessage = message;
				});
			}else{
				state.toastMessage = message;
			}
		},
		updateSchemas: function(state, newSchemas){
			state.schemas = newSchemas;
		},
		addNewEditSchema: function(state, schema){
			const matchedSchemaIndex = _.findIndex(state.schemas, function(el){
				return el.tableSlug == schema.tableSlug;
			});
			if(matchedSchemaIndex > -1){
				state.schemas[matchedSchemaIndex] = schema;
			}else{
				state.schemas.push(schema);
			}
		},
		removeSchema: function(state, tableSlug){
			state.schemas = _.filter(state.schemas, function(el){
				return el.tableSlug != tableSlug;
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
		setLoggedInUser: function(state, username){
			state.loggedInUser = username;
		},
		setCurrentCollection: function(state, result){
			state.currentCollection = result.collection;
			this.commit("setCurrentCollectionSchema", result.tableSlug);
		},
		setCurrentCollectionSchema: function(state, tableSlug){
			const selectedSchema = _.find(state.schemas, function(el){
				return el.tableSlug == tableSlug;
			});
			state.currentCollectionSchema = selectedSchema;
		},
		setCurrentModel: function(state, result){
			state.currentModel = result.model;
			this.commit("setCurrentCollectionSchema", result.tableSlug);
		},
		removeModel: function(state, options){
			const tableSlug = options.tableSlug;
			const model = options.model;

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
			const token = store.get("access_token");
			if(token && Math.floor(Date.now()/1000) < jwtDecode(token).exp){
				const request = generateRequest("schema");
				return sendRequest(request, (requestSuccess, schemas) => {
					if(requestSuccess){
						context.commit("updateSchemas", schemas);
						context.commit("setLoggedIn", true);
						context.commit("setLoggedInUser", jwtDecode(store.get("access_token")).username);
						return Promise.resolve(schemas);
					}else{
						context.commit("setLoggedIn", false);
						context.commit("updateSchemas", []);
						context.commit("setLoggedInUser", "");
						context.commit("setContentView", "login-page");
					}
				});
			}
		},
		submitSchema: function(context, schema){
			const request = generateRequest("schema", "POST", schema);
			return sendRequest(request, (requestSuccess, schemas) => {
				if(requestSuccess){
					context.commit("setCurrentCollectionSchema", schema);
					context.commit("addNewEditSchema", schema);
					return Promise.resolve(schema);
				}else{
					return Promise.reject(schema);
				}
			});
		},
		deleteSchema: function(context, tableSlug){
			const request = generateRequest(`schema/${tableSlug}`, "DELETE");
			return sendRequest(request, (requestSuccess, schemas) => {
				if(requestSuccess){
					context.commit("removeSchema", tableSlug);
					return Promise.resolve(schemas);
				}else{
					return Promise.reject(schema);
				}
			});
		},
		fetchUsersList: function(context){
			const token = store.get("access_token");
			if(token && Math.floor(Date.now()/1000) < jwtDecode(token).exp){
				const request = generateRequest("users");
				return sendRequest(request, (requestSuccess, users) => {
					if(requestSuccess){
						context.commit("updateUsersList", users);
						return Promise.resolve(users);
					}else{
						return Promise.reject(users);
					}
				});
			}
		},
		fetchInitialData: function(context){
			return Promise.all([
				context.dispatch("fetchSchemas"),
				context.dispatch("fetchUsersList")
			]);
		},
		fetchCollection: function(context, tableSlug){
			const request = generateRequest(`collections/${tableSlug}`);
			return sendRequest(request, (requestSuccess, collection) => {
				if(requestSuccess){
					context.commit("setCurrentCollection", {
						collection,
						tableSlug
					});

					return Promise.resolve(collection);
				}else{
					return Promise.reject(collection);
				}
			});
		},
		fetchModel: function(context, options){
			const tableSlug = options.tableSlug;
			const uid = options.uid;
			const request = generateRequest(`collections/${tableSlug}/${uid}`);
			return sendRequest(request, (requestSuccess, model) => {
				if(requestSuccess){
					context.commit("setCurrentModel", {
						tableSlug,
						model
					});

					return Promise.resolve(model);
				}else{
					return Promise.reject(model);
				}
			});
		},
		submitModel: function(context, options){
			const model = options.model;
			const tableSlug = options.tableSlug;
			const uid = options.uid;

			// Check if there's upload field
			const files = _.reduce(model, (acc, el, key) => {
				if(el.file) {
					acc[key] = el.file;
				}
				return acc;
			}, {});

			if(_.size(files) > 0){
				// There are at least one upload field
				// Remove the binary file entry from the model
				_.each(model, (el) => {
					if(el.file){
						delete el.file;
					}
				});

				// Create the request for submitting the model
				const request = generateRequest(`collections/${tableSlug}/${uid}`, "POST", model);
				// Submit the model
				return sendRequest(request, (requestSuccess, model) => {
					if(requestSuccess){
						return Promise.resolve(model);
					}else{
						return Promise.reject(model);
					}
				}).then((model) => {
					// Model submission successful
					const promises = [];

					// Send individual images according to the link provided in the response
					_.each(model, (el, key) => {
						if(el.permalink){
							const file = _.find(files, (f, k) => {
								return k === key;
							});

							const req = generateRequest(
								`upload/${model[key].uid}`,
								"POST",
								file,
								file.type
							);

							promises.push(sendRequest(req, (success, res) => {
								if(success) {
									return Promise.resolve(res);
								}else{
									return Promise.reject(res);
								}
							}));
						}
					});

					// All images successfully uploaded, resolve promise to model
					return Promise.all(promises).then(() => {
						return Promise.resolve(model);
					});
				});
			}else{
				// There are no upload fields
				const request = generateRequest(`collections/${tableName}/${uid}`, "POST", model);

				return sendRequest(request, (requestSuccess, model) => {
					if(requestSuccess){
						context.commit("setCurrentModel", {
							tableName,
							model
						});
						return Promise.resolve(model);
					}else{
						return Promise.reject(model);
					}
				});
			}
		},
		deleteModel: function(context, options){
			const tableSlug = options.tableSlug;
			const uid = options.uid;
			const request = generateRequest(`collections/${tableSlug}/${uid}`, "DELETE");

			return sendRequest(request, (requestSuccess, model) => {
				if(requestSuccess){
					context.commit("removeModel", {
						tableSlug,
						model
					});
					return Promise.resolve(model);
				}else{
					return Promise.reject(model);
				}
			});
		},

		fetchUser: function(context, username){
			const request = generateRequest(`users/${username}`);
			return sendRequest(request, (requestSuccess, response) => {
				if(requestSuccess){
					return Promise.resolve(response);
				}else{
					return Promise.reject(response);
				}
			});
		},
		deleteUser: function(context, username){
			const request = generateRequest(`users/${username}`, "DELETE");
			return sendRequest(request, (requestSuccess, response) => {
				if(requestSuccess){
					return Promise.resolve(response);
				}else{
					return Promise.reject(response);
				}
			});
		},
		submitUser: function(context, user){
			if(user.role && !user.password){
				const request = generateRequest(`users/${user.username}`, "POST", user);
				return sendRequest(request, (requestSuccess, response) => {
					if(requestSuccess){
						return Promise.resolve(response);
					}else{
						return Promise.reject(response);
					}
				});
			}else if(user.password && !user.role){
				const request = generateRequest("users", "POST", user);
				return sendRequest(request, (requestSuccess, response) => {
					if(requestSuccess){
						return Promise.resolve(response);
					}else{
						return Promise.reject(response);
					}
				});
			}
		},

		/**
		 * Login/Sign up related actions
		 */
		loginUser: function(context, loginDetails){
			const request = generateRequest("tokens/generate_new_token", "POST", loginDetails);
			return sendRequest(request, (requestSuccess, response) => {
				if(requestSuccess){
					store.set("access_token", response.access_token);
					return context.dispatch("fetchInitialData");
				}else{
					return Promise.reject(response);
				}
			});
		},
		signupUser: function(context, signupDetails){
			const request = generateRequest("signup", "POST", signupDetails);
			return sendRequest(request, (requestSuccess, response) => {
				if(requestSuccess){
					return Promise.resolve(response);
				}else{
					return Promise.reject(response);
				}
			});
		},
		submitChangePassword: function(context, details){
			const request = generateRequest("account/change_password", "POST", details);
			return sendRequest(request, (requestSuccess, response) => {
				if(requestSuccess){
					return Promise.resolve(response);
				}else{
					return Promise.reject(response);
				}
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
			accountPage: "account-page"
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

//---------------------------------------------//
//                  Utils                      //
//---------------------------------------------//
/**
 * Generate `request` object to be passed to `fetch` that is populated with all
 * the necessary headers. Also automatically stringify payload body.
 */
function generateRequest(path, method="GET", payload=null, contentType="application/json"){
	const finalURL = urlJoin(url, path);
	const token = store.get("access_token");

	const header = {};
	header["Content-Type"] = contentType;
	if(path !== "token/generate_new_token"){
		header["Authorization"] = `Bearer ${token}`;
	}

	let body;
	if(payload !== null){
		if(contentType === "application/json"){
			body = JSON.stringify(payload);
		}else{
			body = payload;
		}
	}

	const request = new Request(finalURL, {
		method: method,
		body: body,
		headers: new Headers(header)
	});

	return request;
}

/**
 * Returns true if access_token exist and has not expired
 */
function appTokenValid(){
	const token = store.get("access_token");
	if(token){
		const tokenContent = jwtDecode(token);
		if(tokenContent.exp > Math.floor(Date.now()/1000)){
			return true;
		}
	}

	return false;
}

/**
 * Utility function to send fetch request and deal with errors.
 * `responseHandler` callback should return promise resolution
 */
function sendRequest(request, responseHandler){
	let requestSuccess;
	return fetch(request).then((res) => {
		if(res.status >= 200 && res.status < 300){
			requestSuccess = true;
		}else if(res.status >= 400){
			requestSuccess = false;
		}else{
			// PANIC
			throw new Error(request);
		}
		return res.json();
	}).then((response) => {
		return responseHandler(requestSuccess, response);
	});
}