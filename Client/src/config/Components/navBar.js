import React,{useState} from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { startRemoveUser } from '../../action/userAction';
import { connect } from 'react-redux'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
    }
  },
  title: {
    display:'block',
    cursor:'pointer',
    marginRight:theme.spacing(4)
  },
  button:{
    display:'block'
  },
  searchGroup:{
    display:'block',
    padding:theme.spacing(0,2,1,2),
    [theme.breakpoints.up('sm')]: {
      display:'none'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.9),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1),
    },
    
    display:'none',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      display:'block'
    },
  },
  search1: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.9),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1),
    },
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:'black'
  },
  inputRoot: {
    color: 'inherit',
    display:'flex',
    boxSizing:'border-box'
  },
  searchFull:{
    flexGrow:0.8,
    padding:theme.spacing(0,2)
  },
  searchNButtons:{
    display:'flex',
    flexGrow:1,
    alignItems:'center',
    justifyContent:'space-evenly'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    color:'black',
    width: '100%',
  },
  menu:{
    marginTop:theme.spacing(5)
  }
}));

const handleClick = (e,props) =>{
  switch(e){
    case 'logButton':
      if(!props.user._id){
        props.route.history.push('/user/login')
      }
      else{
        const token = localStorage.getItem('x-auth')
        const redirect = () =>{
          props.route.history.push('/')
        }
        props.dispatch(startRemoveUser(token,redirect))
      }
    break;
    case 'supplier':
      if(props.user.supplier){
        props.route.history.push('/supplier/dashboard')
      }
      else{
        console.log('not a supplier')
      }
    break;
    case 'cart':
      if(!props.user._id){
        props.route.history.push('/user/login')
      }
      else{
        props.route.history.push('/user/cart')
      }
    break;
    case 'home':
      props.route.history.push('/')
      break;
    case 'address':
      props.route.history.push('/user/address')
      break;
    case 'editProfile':
      props.route.history.push('/user/editProfile')
      break;
    default:
      console.log('fix navbar switch')
  }
}

function ButtonAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue,setSearchValue] = useState('')
  const open = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" onClick={()=>{setSearchValue('');handleClick('home',props)}} className={classes.title}>
            Exvate
          </Typography>
          <div className={classes.searchNButtons}>
            <div className={classes.searchFull}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchValue}
                  onChange={(ev)=>{
                    ev.persist()
                    setSearchValue(ev.target.value)
                  }}
                  onKeyUp={(ev)=>{
                    if(ev.key==='Enter')
                    props.route.history.push(`/search/${searchValue}`)
                  }}
                />
              </div>
            </div>

            <IconButton onClick={()=>{handleClick("cart",props)}} color="inherit" aria-label="cart">
              <ShoppingCartIcon />
            </IconButton>
            {
              props.user.supplier?
              <Button onClick={()=>{handleClick("supplier",props)}} className={classes.button} color="inherit" >Supplier</Button>:
              <div/>
            }
            {
              !props.user._id?<Button onClick={()=>{handleClick("logButton",props)}} className={classes.button} color="inherit" >Login</Button>:
              <div>
                <Avatar onClick={handleClickMenu}>{props.user.name[0]}</Avatar>
                <Menu
                  id="fade-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  className={classes.menu}
                >
                  <MenuItem onClick={()=>{handleClose();handleClick('address',props)}}>Addresses</MenuItem>
                  <MenuItem onClick={()=>{handleClose();handleClick('editProfile',props)}}>Edit profile</MenuItem>
                  <MenuItem onClick={()=>{handleClose();handleClick('logButton',props)}}>Logout</MenuItem>
                </Menu>
              </div>
            }
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) =>{
  return {
    user:state.user
  }
}

export default connect(mapStateToProps)(ButtonAppBar)