const userReducer = (state={},action) =>{
    switch(action.type){
        case 'SET_USER':
            return action.payload
        case 'ADD_ADDRESS':
            console.log(action.payload)
            state.address.push(action.payload)
            return state
        case 'REMOVE_USER':
            return {}
        default:
            return {...state}
    }
}

export default userReducer