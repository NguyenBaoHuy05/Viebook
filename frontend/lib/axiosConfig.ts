import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.defaults.withCredentials =
  process.env.NEXT_PUBLIC_AXIOS_WITH_CREDENTIALS === "true";

axios.defaults.withXSRFToken = true;

export default axios;
