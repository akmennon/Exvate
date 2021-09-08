
export const setOrder = (payload) => {
    console.log(payload)
    return {type:'SET_ORDER',payload:payload}
}

export const setFinishedOrder = (payload) => {
    console.log(payload)
    return {type:'SET_FINISHED_ORDER',payload:payload}
}

export const removeOrder = () =>{
    return {type:'REMOVE_ORDER'}
}

export const startsetOrder = (payload,redirect) =>{
    return((dispatch)=>{
        dispatch(setOrder(payload))
        redirect()
    })
}