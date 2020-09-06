import urlJoin from "url-join";
import jwtDecode from "jwt-decode";

//---------------------------------------------//
//               App constants                 //
//---------------------------------------------//
export const siteTitle = process.env.SITE_TITLE || "Cotta Admin";
export const url = process.env.SERVER_URL || window.location.origin + "/api";

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
 */
export async function sendRequest(request){
	let success;
	const res = await fetch(request);

	if(res.status >= 200 && res.status < 300){
		success = true;
	}else if(res.status >= 400){
		success = false;
	}else{
		throw new Error("Unknown error occurred");
	}

	const response = await res.json();
	return {success, response};
}