import React from "react";
import { Route } from 'react-router-dom';
import Verify from './Orders/verify'
import Hosts from './Orders/hosts'
import userWorks from './Users/updateWork'
import addWork from './Users/addWork'
import UserOrders from './Users/orders'
import CreateOrder from './Users/createOrder'

export default [
    <Route exact path="/orders/verify/:id" component={Verify} />,
    <Route exact path="/orders/hosts/:id" component={Hosts} />,
    <Route exact path="/users/:id/works" component={userWorks}/>,
    <Route exact path="/users/:id/addWork" component={addWork}/>,
    <Route exact path="/users/:id/orders" component={UserOrders}/>,
    <Route exact path="/users/:id/createOrder" component={CreateOrder}/>
];

