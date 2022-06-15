import React, { useEffect } from 'react'
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom'

import Home from '../components/Home/home'
import Register from '../components/User/register'
import Login from '../components/User/login'
import Forgot from '../components/User/forgot'
import ConfirmForgot from '../components/User/confirmForgot'
import ConfirmSign from '../components/User/confirmSign'
import Work from '../components/Work/workDetails'
import OrderPreivew from '../components/Order/orderPreview'
import OrderConfirm from '../components/Order/orderConfirm'
import Dashboard from '../components/Host/dashboard'
import HostSignUp from '../components/Host/signup'
import Orders from '../components/User/order'
import OrderAddress from '../components/Order/orderAddress'
import Addaddress from '../components/User/addAddress'
import AllAddresses from '../components/User/allAddress'
import OrderPage from '../components/User/orderPage'
import EditProfile from '../components/User/editProfile'
import SearchWork from '../components/Work/searchWork'
import EditFns from '../components/User/editProfileFns'
import EditProfilePassword from '../components/User/editProfilePassword'
import NavBar from '../components/Elements/Navbar'

const RouterComponent = (props) =>{
    let displayOption = true

    return(
        <Router>
                <NavBar displayOption={displayOption}/>
                <Routes>
                    <Route path="/work/:id" element={<Work/>} exact={true}/>
                    <Route path="/orderPreview/:id" element={<OrderPreivew/>} exact={true}/>
                    <Route path="/orderAddress/:id" element={<OrderAddress/>} exact={true}/>
                    <Route path="/user/cart" element={<Orders/>}/>
                    <Route path="/orderConfirm" element={<OrderConfirm/>} exact={true}/>
                    <Route path="/user/signup" element={<Register/>}/>
                    <Route path="/user/login" element={<Login/>}/>
                    <Route path="/user/forgot" element={<Forgot/>}/>
                    <Route path="/user/confirmForgot/:token" element={<ConfirmForgot/>} />
                    <Route path="/user/confirmSign/:token" element={<ConfirmSign/>}/>
                    <Route path="/supplier/dashboard" element={<Dashboard/>}/>
                    <Route path="/supplier/signup" element={<HostSignUp/>}/>
                    <Route path="/user/addAddress" element={<Addaddress/>}/>
                    <Route path="/user/editProfilePassword" element={<EditProfilePassword/>} />
                    <Route path="/user/address" element={<AllAddresses/>}/>
                    <Route path="/user/orderPage/:id" element={<OrderPage/>}/>
                    <Route path="/user/editProfile" element={<EditProfile/>}/>
                    <Route path="/search/:value" element={<SearchWork/>}/>
                    <Route path="/user/editFns/:type" element={<EditFns/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
        </Router>
    )
}

export default RouterComponent;