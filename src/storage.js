import Vue from "vue/dist/vue.esm.browser";
import Vuex from "vuex/dist/vuex.js";
import jwtDecode from "jwt-decode";
import urlJoin from "url-join";
Vue.use(Vuex);

import {url, generateRequest, sendRequest} from "./utils.js";

/**
 * Vuex store initialization
 */
export default new Vuex.Store({
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
			if(context.state.currentCollectionSchema){
				const request = generateRequest(`schema/${context.state.currentCollectionSchema.tableSlug}`, "POST", schema);
				return sendRequest(request, (requestSuccess, schemas) => {
					if(requestSuccess){
						context.commit("setCurrentCollectionSchema", schema);
						context.commit("addNewEditSchema", schema);
						return Promise.resolve("edit");
					}else{
						return Promise.reject(schemas);
					}
				});
			}else{
				const request = generateRequest("schema", "POST", schema);
				return sendRequest(request, (requestSuccess, schemas) => {
					if(requestSuccess){
						context.commit("setCurrentCollectionSchema", schema);
						context.commit("addNewEditSchema", schema);
						return Promise.resolve("new");
					}else{
						return Promise.reject(schemas);
					}
				});
			}
		},
		deleteSchema: function(context, tableSlug){
			const request = generateRequest(`schema/${tableSlug}`, "DELETE");
			return sendRequest(request, (requestSuccess, schemas) => {
				if(requestSuccess){
					context.commit("removeSchema", tableSlug);
					return Promise.resolve(schemas);
				}else{
					return Promise.reject(schemas);
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
			const schema = options.schema;
			const tableSlug = options.tableSlug;
			const uid = options.uid;
			const files = {};

			// Check if there's upload field
			_.each(schema.definition, (el, key) => {
				if(el.app_type == "file"){
					files[key] = _.reduce(model[key], (acc, item) => {
						if(item.file) acc.push(item.file);
						return acc;
					}, []);
				}
			});

			if(_.size(files) > 0){
				// There are at least one upload field
				// Remove the binary file entry from the model
				_.each(schema.definition, (el, key) => {
					if(el.app_type == "file"){
						_.each(model[key], (el2) => {
							if(el2.file) delete el2.file;
						});
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
					_.each(schema.definition, (el, key) => {
						if(el.app_type == "file"){
							_.each(model[key], (el2) => {
								const file = _.find(files[key], (f, k) => {
									return f.name == el2.file_name;
								});

								if(file){
									const req = generateRequest(
										`upload/${el2.uid}`,
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
						}
					});

					// All images successfully uploaded, resolve promise to model
					return Promise.all(promises).then(() => {
						return Promise.resolve(model);
					});
				});
			}else{
				// There are no upload fields
				const request = generateRequest(`collections/${tableSlug}/${uid}`, "POST", model);

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