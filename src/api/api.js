import axios from 'axios'

//Centralized api
const api = axios.create({
    baseURL:'http://localhost:3000/api',
})

export default api