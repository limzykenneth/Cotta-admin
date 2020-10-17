import Vue from "vue";
import Vuex from "vuex";
import jwtDecode from "jwt-decode";
import urlJoin from "url-join";
Vue.use(Vuex);

import {siteTitle, url, generateRequest, sendRequest} from "./utils.js";

/**
 * Vuex store initialization
 */
export default new Vuex.Store({
	/**
	 * Vuex store states initialization.
	 */
	state: {
		siteTitle,
		toastMessage: "",

		loggedIn: false,
		loggedInUser: "",
		schemas: [],
		usersList: [],

		currentContentView: "app-dashboard",
		currentCollection: [],
		currentCollectionSchema: {},
		currentModel: {},
		currentViewUser: {},

		configurations: [],

		files: [],

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
		}
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
			}) || {};
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
		},

		setConfigurations: function(state, configurations){
			state.configurations = configurations;
		},

		setFiles: function(state, files){
			state.files = files;
		}
	},
	/**
	 * Vuex store actions. Used make asynchronous calls to the server and
	 * update the Vuex store by calling Vuex mutations.
	 */
	actions: {
		fetchSchemas: async function(context){
			const token = store.get("access_token");
			if(token && Math.floor(Date.now()/1000) < jwtDecode(token).exp){
				const request = generateRequest("schema");
				const {success, response} = await sendRequest(request);

				if(success){
					context.commit("updateSchemas", response);
					context.commit("setLoggedIn", true);
					context.commit("setLoggedInUser", jwtDecode(store.get("access_token")).username);
					return response;
				}else{
					context.commit("setLoggedIn", false);
					context.commit("updateSchemas", []);
					context.commit("setLoggedInUser", "");
					context.commit("setContentView", "login-page");
				}
			}
		},
		submitSchema: async function(context, schema){
			if(context.state.currentCollectionSchema){
				// Editing schema
				const request = generateRequest(`schema/${context.state.currentCollectionSchema.tableSlug}`, "POST", schema);
				const {success, response} = await sendRequest(request);
				if(success){
					context.commit("setCurrentCollectionSchema", schema);
					context.commit("addNewEditSchema", schema);
					return "edit";
				}else{
					throw response;
				}
			}else{
				// Creating new schema
				const request = generateRequest("schema", "POST", schema);
				const {success, response} = await sendRequest(request);
				if(success){
					context.commit("setCurrentCollectionSchema", schema);
					context.commit("addNewEditSchema", schema);
					return "new";
				}else{
					throw response;
				}
			}
		},
		deleteSchema: async function(context, tableSlug){
			const request = generateRequest(`schema/${tableSlug}`, "DELETE");
			const {success, response} = await sendRequest(request);

			if(success){
				context.commit("removeSchema", tableSlug);
				return response;
			}else{
				throw response;
			}
		},
		fetchUsersList: async function(context){
			const token = store.get("access_token");

			if(token && Math.floor(Date.now()/1000) < jwtDecode(token).exp){
				const request = generateRequest("users");

				const {success, response} = await sendRequest(request);
				if(success){
					context.commit("updateUsersList", response);
					return response;
				}else{
					throw response;
				}
			}
		},
		fetchInitialData: function(context){
			return Promise.all([
				context.dispatch("fetchSchemas"),
				context.dispatch("fetchUsersList")
			]);
		},
		fetchCollection: async function(context, tableSlug){
			const request = generateRequest(`collections/${tableSlug}`);
			const {success, response} = await sendRequest(request);

			if(success){
				context.commit("setCurrentCollection", {
					collection: response,
					tableSlug
				});

				return response;
			}else{
				throw response;
			}
		},
		fetchModel: async function(context, options){
			const tableSlug = options.tableSlug;
			const uid = options.uid;
			const request = generateRequest(`collections/${tableSlug}/${uid}`);
			const {success, response} = await sendRequest(request);

			if(success){
				context.commit("setCurrentModel", {
					tableSlug,
					model: response
				});

				return response;
			}else{
				throw response;
			}
		},
		submitModel: async function(context, options){
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

				let failed = null;
				const configs = await context.dispatch("fetchConfigurations");

				// Check file size
				const maxFileSize = _.find(configs, (config) => {
					return config.config_name === "upload_file_size_max";
				}).config_value;

				_.each(files, (file) => {
					for(const f of file){
						if(f.size > maxFileSize){
							failed = f.name;
							break;
						}
					}
				});

				if(failed !== null){
					throw new Error(`File "${failed}" exceeds maximum upload file size allowed.`);
				}

				// Check file type
				const acceptedFileMIME = _.find(configs, (config) => {
					return config.config_name === "upload_file_accepted_MIME";
				}).config_value;

				_.each(files, (file) => {
					for(const f of file){
						if(!_.contains(acceptedFileMIME, f.type)){
							failed = f.name;
							break;
						}
					}
				});

				if(failed !== null){
					throw new Error(`File "${failed}" is of a type that is not allowed.`);
				}

				// Create the request for submitting the model
				const request = generateRequest(`collections/${tableSlug}/${uid}`, "POST", model);

				// Submit the model
				const {success, response} = await sendRequest(request);

				if(success){
					const model = response;
					const promises = [];

					// Send individual images according to the link provided in the response
					_.each(schema.definition, (definition, key) => {
						if(definition.app_type == "file"){
							_.each(model[key], (property) => {
								const file = _.find(files[key], (f) => {
									return f.name == property.file_name;
								});

								if(file){
									const req = generateRequest(
										`upload/${property.uid}`,
										"POST",
										file,
										file.type
									);

									promises.push(
										sendRequest(req).then(({success, response}) => {
											if(success){
												return response;
											}else{
												throw response;
											}
										})
									);
								}
							});
						}
					});

					// All files successfully uploaded, resolve promise to model
					await Promise.all(promises);
					return model;
				}else{
					throw response;
				}

			}else{
				// There are no upload fields
				const request = generateRequest(`collections/${tableSlug}/${uid}`, "POST", model);

				const {success, response} = await sendRequest(request);
				if(success){
					context.commit("setCurrentModel", {
						tableSlug,
						model: response
					});

					return response;
				}else{
					throw response;
				}
			}
		},
		deleteModel: async function(context, options){
			const tableSlug = options.tableSlug;
			const uid = options.uid;
			const request = generateRequest(`collections/${tableSlug}/${uid}`, "DELETE");

			const {success, response} = await sendRequest(request);
			if(success){
				context.commit("removeModel", {
					tableSlug,
					model: response
				});

				return response;
			}else{
				throw response;
			}
		},
		fetchUser: async function(context, username){
			const request = generateRequest(`users/${username}`);
			const {success, response} = await sendRequest(request);
			if(success){
				return response;
			}else{
				throw response;
			}
		},
		deleteUser: async function(context, username){
			const request = generateRequest(`users/${username}`, "DELETE");
			const {success, response} = await sendRequest(request);
			if(success){
				return response;
			}else{
				throw response;
			}
		},
		submitUser: async function(context, user){
			if(user.role && !user.password){
				// Edit user role
				const request = generateRequest(`users/${user.username}`, "POST", user);
				const {success, response} = await sendRequest(request);
				if(success){
					return response;
				}else{
					throw response;
				}
			}else if(user.password && !user.role){
				// Edit user password
				const request = generateRequest("users", "POST", user);
				const {success, response} = await sendRequest(request);
				if(success){
					return response;
				}else{
					throw response;
				}
			}
		},

		/**
		 * Login/Sign up related actions
		 */
		loginUser: async function(context, loginDetails){
			const request = generateRequest("tokens/generate_new_token", "POST", loginDetails);
			const {success, response} = await sendRequest(request);

			if(success){
				store.set("access_token", response.access_token);
				return context.dispatch("fetchInitialData");
			}else{
				throw response;
			}
		},
		signupUser: async function(context, signupDetails){
			const request = generateRequest("signup", "POST", signupDetails);
			const {success, response} = await sendRequest(request);

			if(success){
				return response;
			}else{
				throw response;
			}
		},
		submitChangePassword: async function(context, details){
			const request = generateRequest("account/change_password", "POST", details);
			const {success, response} = await sendRequest(request);

			if(success){
				return response;
			}else{
				throw response;
			}
		},

		/**
		 * Configurations related actions
		 */
		fetchConfigurations: async function(context){
			const request = generateRequest("config");
			const {success, response} = await sendRequest(request);

			if(success){
				return response;
			}else{
				throw response;
			}
		},
		submitConfigurations: async function(context, result){
			const request = generateRequest(`config/${result.config_name}`, "POST", result);
			const {success, response} = await sendRequest(request);

			if(success){
				return response;
			}else{
				throw response;
			}
		},

		/**
		 * Files related actions
		 */
		fetchFiles: async function(context){
			const request = generateRequest("files");
			const {success, response} = await sendRequest(request);

			if(success){
				return response;
			}else{
				throw response;
			}
		},
		deleteFile: async function(context, file){
			const request = generateRequest(`files/${file.uid}`, "DELETE");
			const {success, response} = await sendRequest(request);

			if(success){
				return response;
			}else{
				throw response;
			}
		}
	}
});