const profileReducer = (state={},action) =>{
    switch(action.type){
        case 'SET_PROFILE':
            return action.payload
        case 'REMOVE_PROFILE':
            return {}
        case 'SET_PROFILE_VALUE':
            return {...state,...action.payload}
        default:
            return state
    }
}

export default profileReducer