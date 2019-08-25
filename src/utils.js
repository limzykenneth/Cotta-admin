import urlJoin from "url-join";
import jwtDecode from "jwt-decode";

//---------------------------------------------//
//               App constants                 //
//---------------------------------------------//
export const siteTitle = "Char Admin";
export const url = "http://localhost:3000/api";

//---------------------------------------------//
//                  Utils                      //
//---------------------------------------------//
/**
 * Generate `request` object to be passed to `fetch` that is populated with all
 * the necessary headers. Also automatically stringify payload body.
 */
export function generateRequest(path, method="GET", payload=null, contentType="application/json"){
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
export function appTokenValid(){
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
export function sendRequest(request, responseHandler){
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