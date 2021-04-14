const workReducer = (state={},action) =>{ // Changed the usage (to be used for an array of works not on the workdetails)
    switch(action.type){
        case 'SET_WORK':
            return action.payload
        default:
            return state
    }
}

export default workReducer