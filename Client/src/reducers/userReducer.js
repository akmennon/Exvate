const userReducer = (state={},action) =>{
    switch(action.type){
        case 'SET_USER':
            return action.payload
        case 'ADD_ADDRESS':
            state.address.push(action.payload)
            return state
        case 'REMOVE_ADDRESS':
            console.log(state)
            state.address = state.address.filter(ele=>ele._id!==action.payload)
            return state
        case 'REMOVE_USER':
            return {}
        default:
            return {...state}
    }
}

export default userReducer