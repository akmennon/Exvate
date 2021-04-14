import axios from '../config/axios'

export const setWork = (work) =>{
    return {type:'SET_WORK',payload:work}
}

export const startSetWork = (id) =>{
    return ((dispatch)=>{
        axios.get(`/works/${id}`)
            .then((response)=>{
                console.log(response.data)
                dispatch(setWork(response.data))
            })
            .catch((err)=>{
                console.log(err)
            })
    })
}