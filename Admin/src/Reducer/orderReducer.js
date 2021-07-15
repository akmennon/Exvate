
const orderReducer = (state={},action) =>{
    switch(action.type){
        case 'SET_ORDER':
            if(action.payload){
                return action.payload
            }
            else{
                return null
            }
        case 'REMOVE_ORDER':
            return {}
        default:
            return state
    }
}

export default orderReducer