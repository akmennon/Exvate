import Axios from 'axios'

const axios = Axios.create({
    baseURL:'http://localhost:3015/admin'
})

export default axios