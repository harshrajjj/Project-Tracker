import axiosInstance from './axiosConfig';
import { toast } from 'react-toastify';

/**
 * Pings the server to wake it up if it's in sleep mode
 * Render free tier servers go to sleep after 15 minutes of inactivity
 */
export const pingServer = async () => {
  try {
    console.log('Pinging server to wake it up...');
    const startTime = Date.now();
    
    // Make a request to the root endpoint
    const response = await axiosInstance.get('/');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`Server responded in ${responseTime}ms with status: ${response.status}`);
    
    // If response time is more than 2 seconds, the server was likely asleep
    if (responseTime > 2000) {
      toast.info('Server is starting up. Login might take a moment.', {
        autoClose: 5000
      });
    }
    
    return true;
  } catch (error) {
    console.log('Server ping failed, it might be starting up:', error.message);
    
    // Show a toast notification that the server might be starting up
    toast.info('Server is starting up. Please wait a moment before logging in.', {
      autoClose: 8000
    });
    
    return false;
  }
};

export default pingServer;
