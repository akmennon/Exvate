import React from "react";
import { Route } from 'react-router-dom';
import Hosts from './Orders/hosts'
import userWorks from './Users/works'
import addWork from './Users/addWork'
import UserOrders from './Users/orders'
import CreateOrder from './Users/createOrder'
import updateWork from './Users/updateWork'

const exportArray = [
    <Route exact path="/orders/hosts/:id" component={Hosts} />,
    <Route exact path="/users/:id/works" component={userWorks}/>,
    <Route exact path="/users/:id/addWork" component={addWork}/>,
    <Route exact path="/users/:id/orders" component={UserOrders}/>,
    <Route exact path="/users/:id/createOrder" component={CreateOrder}/>,
    <Route exact path="/users/:id/updateWork/:workId" component={updateWork}/>
];
export default exportArray