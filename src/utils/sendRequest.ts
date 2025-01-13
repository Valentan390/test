import axios from 'axios';

export const sendRequest = async () => {
  const localhost = process.env.Local_Host;

  try {
    const { data } = await axios.get<string>(`http://${localhost}`);
    console.log('Server Response:', data);
  } catch (error) {
    console.error('Error making request:', error.message);
  }
};
