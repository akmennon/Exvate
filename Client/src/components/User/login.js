import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles'
import axios from '../../config/axios'

import {startSetUser,startTokenSetUser} from '../../action/userAction'
import { useDispatch } from 'react-redux';

//Just a template, furthur work required

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Exvate
      </Link>{' '}
      2021
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    resendMail:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    }
  }))

const resendMail = (auth,setAuth) =>{
    axios.post('/user/resendRegisterMail',{email:auth.email})
        .then((response)=>{
            console.log(response.data)
            if(response.data.status){
                setAuth(p=>({...p,resendMail:false}))
                console.log(response.data.message)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
}

const SignIn = (props) => {
    const [auth,setAuth] = useState({ email:'', password:'', resendMail:false })
    const dispatch = useDispatch()

    useEffect(()=>{
        const token = localStorage.getItem('x-auth')
        if(token&&token!=='undefined')
        {
            const redirect = () =>{props.history.push('/')}
            dispatch(startTokenSetUser(token,redirect))
        }
    },[])

    const classes = useStyles()

    const handleSubmit = (e) =>{
        e.preventDefault()
        const loginData = {
            email: auth.email,
            password: auth.password
        }
        const redirect = () =>{
            props.history.goBack()
        }
        dispatch(startSetUser(loginData,redirect,setAuth))
    }

    const handleClick = (e) =>{
        const {name,value} = e.target
        if(auth.resendMail){
            setAuth(p=>({...p,resendMail:false}))
        }
        switch(e.target.name){
            case 'forgotPassword':
                props.history.push('/user/forgot')
            break;
            case 'register':
                props.history.push('/user/signup')
            break;
            default:
                {
                    setAuth(p=>({
                        ...p,[name]:value
                    }))
                }
        }
    }

    console.log(auth)
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={(e)=>handleClick(e)}
                autoComplete="email"
                />
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                value={auth.password}
                onChange={(e)=>{handleClick(e)}}
                type="password"
                id="password"
                autoComplete="current-password"
                />
                <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                />
                {
                    auth.resendMail?(
                        <div className={classes.resendMail}>
                            <Typography variant="subtitle1">
                                Email not verified, resend?
                            </Typography>
                            <Button
                            onClick={()=>resendMail(auth,setAuth)}
                            variant="contained"
                            className={classes.submit}
                            >
                            Resend
                            </Button>
                        </div>
                    ):<span/>
                }
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                >
                Sign In
                </Button>
                <Grid container>
                <Grid item xs>
                    <Link href="http://localhost:3000/user/forgot" variant="body2">
                    Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="http://localhost:3000/user/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
                </Grid>
            </form>
            </div>
            <Box mt={8}>
            <Copyright />
            </Box>
        </Container>
    );
}

export default SignIn