import axios from '../../config/axios'

const localToken = () =>{
    let token = localStorage.getItem('x-auth')
    if(token)
    {
    axios.get('/user/account',{
        headers:{
        'x-auth':localStorage.getItem('x-auth')
        }
    })
    .then((response)=>{
        store.dispatch(setUser(response.data))
        console.log(store.getState())
    })
    .catch((err)=>{
        console.log(err)
    })
    }
}

export default localToken //maybe redundunt