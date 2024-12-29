import axios from 'axios';

axios.defaults.withCredentials = true;  // Ensure cookies are sent with requests

// Function to get the CSRF token from cookies
function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

// Check if CSRF token is present in cookies
const csrfToken = getCookie('XSRF-TOKEN');
if (csrfToken) {
  console.log('CSRF Token:', csrfToken); // Debugging: log CSRF token
  axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
} else {
  console.error('CSRF Token not found!');
}

export default axios;
