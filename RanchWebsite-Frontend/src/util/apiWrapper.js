import Cookies from "js-cookie";
import logout from "./logout";

export const api_host = process.env.REACT_APP_API_HOST
  ? process.env.REACT_APP_API_HOST
  : "localhost";
export const api_port = process.env.REACT_APP_API_PORT
  ? process.env.REACT_APP_API_PORT
  : "5000";

const api_url =
  process.env.NODE_ENV === "production"
    ? `https://${api_host}`
    : `http://${api_host}:${api_port}`;

export default function asyncAPICall(
  api_endpoint,
  method = "GET",
  body = {},
  response_callback_method = null,
  data_callback_method = null,
  catch_callback_method = null,
  signal = null,
  require_auth_token = true,
  headers = null,
  doNotStringifyBody = false
) {
  let auth_token = Cookies.get("auth_token");

  if (require_auth_token) {
    if (!auth_token || auth_token === "") {
      console.log("Auth Token Required");
      return false;
    }

    let expiration = Cookies.get("auth_expires");
    if (Date.parse(expiration) < Date.now()) {
      // We have an expired token, so, break
      console.log("Expired Auth Token");
      return false;
    }
  }

  if (auth_token) {
    if (!headers) {
      headers = { "content-type": "application/json", auth_token: auth_token };
    } else {
      if (!("auth_token" in headers)) {
        headers["auth_token"] = auth_token;
      }
    }
    let payload = { method: method, headers: headers };
    if (method === "POST") {
      if (doNotStringifyBody) {
        payload.body = body;
      } else {
        payload.body = JSON.stringify(body);
      }
    }
    let response_function = (response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 403 || response.status === 401) {
        logout();
      }
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    };
    if (response_callback_method) {
      response_function = response_callback_method;
    }
    let data_function = (data) => {};
    if (data_callback_method) {
      data_function = data_callback_method;
    }
    let catch_function = (error) => console.log(error);
    if (catch_callback_method) {
      catch_function = catch_callback_method;
    }

    if (signal) {
      payload.signal = signal;
    }

    fetch(`${api_url}${api_endpoint}`, payload)
      .then((response) => response_function(response))
      .then((response) => data_function(response))
      .catch((response) => catch_function(response));

    return true;
  } else {
    return false;
  }
}

export function awaitAPICall(
  api_endpoint,
  method = "GET",
  body = {},
  response_callback_method = null,
  data_callback_method = null,
  catch_callback_method = null,
  signal = null,
  require_auth_token = true
) {
  let auth_token = Cookies.get("auth_token");
  let expiration = Cookies.get("auth_expires");
  if (Date.parse(expiration) < Date.now()) {
    // We have an expired token, so, break
    console.log("Expired Auth Token");
    return false;
  }

  if (!require_auth_token) {
    auth_token = "not_required";
  }
  if (auth_token) {
    let payload = {
      method: method,
      headers: { "content-type": "application/json", auth_token: auth_token },
    };
    if (method === "POST") {
      payload.body = JSON.stringify(body);
    }
    let response_function = (response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 403 || response.status === 401) {
        // Cookies.remove('auth_token');
        logout();
      }
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    };
    if (response_callback_method) {
      response_function = response_callback_method;
    }
    let data_function = (data) => {};
    if (data_callback_method) {
      data_function = data_callback_method;
    }
    let catch_function = (error) => console.log(error);
    if (catch_callback_method) {
      catch_function = catch_callback_method;
    }

    if (signal) {
      payload.signal = signal;
    }

    let fetchFromAPI = async () => {
      try {
        let response = await fetch(`${api_url}${api_endpoint}`, payload);
        let results = await response_function(response);
        await data_function(results);
      } catch (error) {
        catch_function(error);
        return false;
      }
    };

    fetchFromAPI();

    return true;
  } else {
    return false;
  }
}
