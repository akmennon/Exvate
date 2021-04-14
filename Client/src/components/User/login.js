import React from 'react'
import {connect} from 'react-redux'
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
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import {startSetUser,startTokenSetUser} from '../../action/userAction'

//Just a template, furthur work required

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = (theme) => ({
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
});

class SignIn extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email:'',
            password:'',
            resendMail:''
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        const loginData = {
            email: this.state.email,
            password: this.state.password
        }
        const redirect = () =>{
            this.props.history.goBack()
        }
        this.props.dispatch(startSetUser(loginData,redirect))
    }

    handleClick = (e) =>{
        switch(e.target.name){
            case 'forgotPassword':
                this.props.history.push('/user/forgot')
            break;
            case 'register':
                this.props.history.push('/user/signup')
            break;
            default:
                {
                    this.setState({
                        [e.target.name]:e.target.value
                    })
                }
        }
    }

    componentDidMount(){
        const token = localStorage.getItem('x-auth')
        if(token&&token!=='undefined')
        {
            const redirect = () =>{this.props.history.push('/')}
            this.props.dispatch(startTokenSetUser(token,redirect))
        }
    }

    render(){
      const {classes} = this.props
      console.log(this.props)
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
                <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={this.handleClick}
                    autoComplete="email"
                    />
                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    onChange={this.handleClick}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    />
                    <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                    />
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
}

const mapStateToProps = (state) =>{
    return{
        user:state.user
    }
}

export default connect(mapStateToProps)(withStyles(styles)(SignIn))