import axios from 'axios';

const externalApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer qfNA3Lc6gcuXwQMRZvGfWN',
  },
});

export default externalApi;
