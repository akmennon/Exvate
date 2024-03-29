import React,{useEffect, useState} from 'react';
import {alpha} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { startRemoveUser } from '../../action/userAction';
import { connect } from 'react-redux'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import {removeProfile} from '../../action/profileAction'
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../axios'
import { useNavigate } from 'react-router-dom';

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
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
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
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 1),
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
    justifyContent: 'flex-end',
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

const handleClick = (e,props,navigate) =>{
  switch(e){
    case 'logButton':
      if(!props.user._id){
        navigate('/user/login')
      }
      else{
        const token = localStorage.getItem('x-auth')
        const redirect = () =>{
          navigate('/')
        }
        props.dispatch(removeProfile())
        props.dispatch(startRemoveUser(token,redirect))
      }
    break;
    case 'supplier':
      if(props.user.supplier){
        navigate('/supplier/dashboard')
      }
      else{
        console.log('not a supplier')
      }
    break;
    case 'cart':
      if(!props.user._id){
        navigate('/user/login')
      }
      else{
        navigate('/user/cart')
      }
    break;
    case 'home':
      navigate('/')
      break;
    case 'address':
      navigate('/user/address')
      break;
    case 'editProfile':
      navigate('/user/editProfilePassword')
      break;
    default:
      console.log('fix navbar switch')
  }
}

const getData = (searchValue,setOptions) =>{
  axios.post('/works/search',{query:searchValue,autoSearch:true})
  .then((response)=>{
    setOptions(response.data)
  })
  .catch((err)=>{
    console.log(err)
  })
}

function ButtonAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue,setSearchValue] = useState('')
  const [openSearch,setOpenSearch] = useState(false)
  const [loading,setLoading] = useState(false)
  const [options,setOptions] = useState([])
  const [timeouts,setTimeouts] = useState([])
  const navigate = useNavigate()

  const open = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(()=>{
    if(searchValue&&searchValue.length>1){
      setLoading(true)

      if(timeouts.length!==0){
        setTimeouts((p)=>{
          p.forEach((val)=>{
            clearTimeout(val)
          })
          p=[]
          return p
        })
      }

      setTimeouts((timArray)=>{
        timArray.push(
          setTimeout( async ()=>{
            await getData(searchValue,setOptions)
            setLoading(false)
          },2000)
        )
        return timArray
      })
    }
    else{
      setLoading(false)
      setOpenSearch(false)
    }
  },[searchValue])

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" onClick={()=>{setSearchValue('');handleClick('home',props,navigate)}} className={classes.title}>
            Exvate
          </Typography>
          <div className={classes.searchNButtons}>
            <div className={classes.searchFull}>
              <div className={classes.search}>
                <Autocomplete
                  open={openSearch}
                  onOpen={() => {
                    setOpenSearch(true);
                  }}
                  onClose={() => {
                    setOpenSearch(false);
                  }}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  filterOptions={(x) => x}
                  getOptionLabel={(option) => {
                    if (option.hasOwnProperty('title')) {
                      return option.title;
                    }
                    return option;
                  }}
                  options={options}
                  loading={loading}
                  value={searchValue}
                  onInputChange={(ev,val)=>{
                    setSearchValue(val)
                  }}
                  onChange={(ev,val)=>{
                    setSearchValue('')
                    if(val&&val._id){
                      navigate(`/work/${val._id}`)
                    }
                  }}
                  freeSolo={true}
                  onKeyUp={(ev)=>{
                      if(ev.key==='Enter'&&searchValue){
                        setSearchValue('')
                        setOpenSearch(false)
                        navigate(`/search/${searchValue}`)
                      }
                    }
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<SearchIcon />}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <IconButton onClick={()=>{handleClick("cart",props,navigate)}} color="inherit" aria-label="cart">
              <ShoppingCartIcon />
            </IconButton>
            {
              props.user.supplier?
              <Button onClick={()=>{handleClick("supplier",props,navigate)}} className={classes.button} color="inherit" >Supplier</Button>:
              <div/>
            }
            {
              !props.user._id?<Button onClick={()=>{handleClick("logButton",props,navigate)}} className={classes.button} color="inherit" >Login</Button>:
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
                  <MenuItem onClick={()=>{handleClose();handleClick('address',props,navigate)}}>Addresses</MenuItem>
                  <MenuItem onClick={()=>{handleClose();handleClick('editProfile',props,navigate)}}>Edit profile</MenuItem>
                  <MenuItem onClick={()=>{handleClose();handleClick('logButton',props,navigate)}}>Logout</MenuItem>
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