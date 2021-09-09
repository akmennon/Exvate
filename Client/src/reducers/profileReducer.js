const profileReducer = (state={},action) =>{
    switch(action.type){
        case 'SET_PROFILE':
            return action.payload
        case 'REMOVE_PROFILE':
            return {}
        default:
            return state
    }
}

export default profileReducer