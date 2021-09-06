import React from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {startRemoveUser} from '../action/userAction' //Logout action
import MenuAppBar from './Components/navBar'    //Navbar component
import { Grid } from '@material-ui/core'

import Home from '../components/Home/home'
import Register from '../components/User/register'
import Login from '../components/User/login'
import Forgot from '../components/User/forgot'
import ConfirmForgot from '../components/User/confirmForgot'
import ConfirmSign from '../components/User/confirmSign'
import ResendEmail from '../components/User/resendEmail'
import Work from '../components/Work/workDetails'
import OrderPreivew from '../components/Order/orderPreview'
import OrderConfirm from '../components/Order/orderConfirm'
import Dashboard from '../components/Host/dashboard'
import HostSignUp from '../components/Host/signup'
import Orders from '../components/User/order'
import OrderAddress from '../components/Order/orderAddress'
import Addaddress from '../components/User/addAddress'
import AllAddresses from '../components/User/allAddress'

let NavRoute = function({component:Component,path,exact}){  //Custom route with navbar
    return(
        <Route
            path={path}
            exact={exact}
            render={(routeProps)=>(
                <Grid container direction='column'>
                    <Grid item>
                        <MenuAppBar route={routeProps}/>
                    </Grid>
                    <Grid item container>
                        <Component {...routeProps}/>
                    </Grid>
                </Grid>
            )}
        />
    )
}

class Router extends React.Component{
    constructor(props){
        super(props)
        NavRoute = NavRoute.bind(this)
    }

    handleClick = (e) =>{
        switch(e.target.name){
            case 'logout':
                const token = localStorage.getItem('x-auth')
                const redirect = () =>{
                window.location.assign('/')
                }
                this.props.dispatch(startRemoveUser(token,redirect))
            break;
            case 'login':
                window.location.assign('/user/login')
            break;
            default:
                console.log('fix handlclick switch router.js')
            break;
        }
    }

    render(){
        return(
            <BrowserRouter>
                <Switch>
                    <NavRoute path="/" component={Home} exact={true}/>
                    <NavRoute path="/work/:id" component={Work} exact={true}/>
                    <NavRoute path="/orderPreview/:id" component={OrderPreivew} exact={true}/>
                    <NavRoute path="/orderAddress/:id" component={OrderAddress} exact={true}/>
                    <NavRoute path="/user/cart" component={Orders} />
                    <Route path="/orderConfirm" component={OrderConfirm} exact={true}/>
                    <Route path="/user/signup" component={Register} />
                    <Route path="/user/login" component={Login} />
                    <Route path="/user/forgot" component={Forgot} />
                    <Route path="/user/confirmForgot/:token" component={ConfirmForgot} />
                    <Route path="/user/confirmSign/:token" component={ConfirmSign}/>
                    <Route path="/user/resendEmail" component={ResendEmail}/>
                    <Route path="/supplier/dashboard" component={Dashboard}/>
                    <Route path="/supplier/signup" component={HostSignUp} />
                    <Route path="/user/addAddress" component={Addaddress} />
                    <NavRoute path="/user/address" component={AllAddresses} />
                </Switch>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
      user:state.user
    }
  }

  export default connect(mapStateToProps)(Router);