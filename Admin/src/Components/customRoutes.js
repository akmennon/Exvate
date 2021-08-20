import React from "react";
import { Route } from 'react-router-dom';
import Suppliers from './Orders/suppliers'
import userWorks from './Users/works'
import addWork from './Users/addWork'
import UserOrders from './Users/orders'
import CreateOrder from './Users/createOrder'
import workOrders from './Users/workOrders'
import updateWork from './Users/updateWork'
import orderCharges from './Orders/orderCharges'

const exportArray = [
    <Route exact path="/orders/suppliers/:id" component={Suppliers} />,
    <Route exact path="/users/:id/works" component={userWorks}/>,
    <Route exact path="/users/:id/addWork" component={addWork}/>,
    <Route exact path="/users/:id/orders" component={UserOrders}/>,
    <Route exact path="/users/:id/createOrder" component={CreateOrder}/>,
    <Route exact path="/users/:id/updateWork/:workId" component={updateWork}/>,
    <Route exact path="/suppliers/:id/workOrders" component={workOrders}/>,
    <Route exact path="/orders/:id/charges" component={orderCharges}/>
];
export default exportArray