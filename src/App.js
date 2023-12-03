import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Users from './components/Users';

function App() {
  const url =
    'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url);
        setData(response.data);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(url);
  }, [url]);

  return (
    <>
      {fetchError && <h1>{fetchError}</h1>}
      {!fetchError && isLoading && <h1>Data Loading...</h1>}
      {!isLoading && <Users users={data} />}
    </>
  );
}

export default App;
