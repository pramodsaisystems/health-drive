import axios from 'axios';
import { APP_API_URL } from './urls';
let alert = null;
const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookiePair = cookies[i].split('=');
    if (cookiePair[0] === name) {
      return decodeURIComponent(cookiePair[1]); // Return the cookie value
    }
  }
  return null; // Return null if not found
};

//For CMS API
let API = axios.create({
  baseURL: APP_API_URL,
  headers: {
    'Content-Type': 'application/json'

    // withCredentials: true
    // observe: 'response'
    // MFA_TrustedDevice: getCookie('MFA_TrustedDevice')
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    // "Access-Control-Allow-Headers": "Content-Type",
  }
});

let API1 = axios.create({
  baseURL: APP_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
    // withCredentials: true
    // observe: 'response'
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    // "Access-Control-Allow-Headers": "Content-Type",
  }
});

let API2 = axios.create({
  baseURL: APP_API_URL,
  headers: {
    'Content-Type': 'application/json'

    // withCredentials: true
    // observe: 'response'
    // MFA_TrustedDevice: getCookie('MFA_TrustedDevice')
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    // "Access-Control-Allow-Headers": "Content-Type",
  }
});

// Set the AUTH token for every request
API.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.headers['LoginDeviceId'] = localStorage.getItem('LoginDeviceId') ? localStorage.getItem('LoginDeviceId') : '';
  config.params = {
    ...config.params
  };

  return config;
});

// Set the AUTH token for every request
API1.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.params = {
    ...config.params
  };

  return config;
});

const get = (url, data?) => {
  return API.get(url, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

const post = (url, data) => {
  return API.post(url, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

const put = (url, data) => {
  return API.put(url, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

const deleteAPI = (url) => {
  return API.delete(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

const postFD = (url, data) => {
  return API1.post(url, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

const putFD = (url, data) => {
  return API1.put(url, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

const redirect = (error: any) => {
  if (alert) {
    setTimeout(() => {
      alert = null;
    }, 2000);
  } else {
    window.location.href = '/guest/login';
    alert = new Date();
    window.alert(error?.response?.data?.error ? error.response.data.error : 'Unexpected error occured!');
    localStorage.clear();
    sessionStorage.clear();
  }
};

const get1 = (url, data?) => {
  return API2.get(url, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error?.status === 401) {
        redirect(error);
      }
      console.log(error);
      return error;
    });
};

export { get, post, put, deleteAPI, postFD, putFD, get1 };
