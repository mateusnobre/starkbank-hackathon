import axios, { AxiosRequestConfig } from 'axios';


async function Api(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, payload?: any) {
  const password = process.env.REACT_APP_PASSWORD;
  const baseURL = process.env.REACT_APP_BASE_URL;
  const url = `${baseURL}/${endpoint}`;

  const headers = {
    Authorization: password,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true
    
  }; 
  
  
  const requestOptions: AxiosRequestConfig = {
    method,
    url,
    headers,
    data: {},
  };

  try {
    const response = await axios(requestOptions);
    console.log(`Webhook ${method} request sent successfully:`, response.data);
  } catch (error) {
    console.error(`Error sending webhook ${method} request`, error);
  }
}

export default Api