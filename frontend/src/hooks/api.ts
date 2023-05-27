import axios, { AxiosRequestConfig } from 'axios';


async function Api(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, payload?: any) {
  const password = process.env.REACT_APP_PASSWORD;
  const baseURL = process.env.REACT_APP_BASE_URL;
  const url = `${baseURL}/${endpoint}`;

  const headers = {
    Authorization: password,
  };

  const requestOptions: AxiosRequestConfig = {
    method,
    url,
    headers,
    data: payload,
  };

  try {
    const response = await axios(requestOptions);
    console.log(`Webhook ${method} request sent successfully:`, response.data);
  } catch (error) {
    console.error(`Error sending webhook ${method} request`);
  }
}

export default Api