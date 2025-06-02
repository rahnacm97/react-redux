// import axios from 'axios'

// //Centralized api
// const api = axios.create({
//     baseURL:'http://localhost:3000/api',
// })

// export default api


import axios from 'axios'

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    })

export default api