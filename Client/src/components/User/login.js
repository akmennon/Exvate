import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {makeStyles} from '@mui/styles'
import axios from '../../config/axios'
import createStyles from '../../styles/headerContact'

import {startSetUser,startTokenSetUser} from '../../action/userAction'
import { useDispatch } from 'react-redux';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const resendMail = (auth,setAuth,setOpen,setMessage) =>{
    axios.post('/user/resendRegisterMail',{email:auth.email})
        .then((response)=>{
            if(response.data.status){
                setAuth(p=>({...p,resendMail:false}))
                setMessage(response.data.message)
                setOpen(true)
            }
        })
        .catch((err)=>{
            setMessage(err.response.data.message)
            setOpen(true)
        })
}

const SignIn = (props) => {
    const [auth,setAuth] = useState({ email:'', password:'', resendMail:false })
    const [open,setOpen] = useState(false)
    const [message,setMessage] = useState('')
    const theme = useTheme()
    const navigate = useNavigate()
    const styles = createStyles(theme)

    const dispatch = useDispatch()

    useEffect(()=>{
        const token = localStorage.getItem('x-auth')
        if(token&&token!=='undefined')
        {
            const redirect = () =>{navigate('/')}
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
            navigate('/',{replace:true})
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
               navigate('/user/forgot')
            break;
            case 'register':
               navigate('/user/signup')
            break;
            default:
                {
                    setAuth(p=>({
                        ...p,[name]:value
                    }))
                }
        }
    }

    return (
        <Grid container >
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
                                    onClick={()=>resendMail(auth,setAuth,setOpen,setMessage)}
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
                <Snackbar
                    open={open}
                    onClose={()=>{setOpen(false)}}
                    TransitionComponent={Fade}
                    message={message}
                />
                <Box mt={8}>
                <Copyright />
                </Box>
            </Container>
        </Grid>
    );
}

export default SignIn