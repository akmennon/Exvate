const orderReducer = (state={},action) =>{
    switch(action.type){
        case 'SET_ORDER':
            return {...state,newOrder:action.payload}
        case 'SET_FINISHED_ORDER':
            return {...state,finishedOrder:action.payload}
        case 'REMOVE_ORDER':
            return {}
        default:
            return state
    }
}

export default orderReducer