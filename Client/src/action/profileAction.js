
export const setProfile = (payload) =>{
    return {type:'SET_PROFILE',payload}
}

export const changeProfileValue = (payload) =>{
    return {type:'SET_PROFILE_VALUE',payload}
}

export const removeProfile = () =>{
    return {type:'REMOVE_PROFILE'}
}