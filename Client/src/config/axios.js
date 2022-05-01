import Axios from 'axios'

const axios = Axios.create({
    baseURL:'http://localhost:3015',
    timeout:20000
})

export default axios