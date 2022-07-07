import Grid from "@mui/material/Grid"
import createStyles from '../../styles/headerContact'
import {useTheme} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {useNavigate,useLocation} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import icon from '../resources/images/exvateLogo.svg'
import {useState,useEffect, Fragment} from 'react'
import { useDispatch, useSelector } from "react-redux"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Fade from "@mui/material/Fade"
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import React from 'react'
import CircularProgress from "@mui/material/CircularProgress"
import axios from "../../config/axios"
import { removeProfile } from "../../action/profileAction"
import { startRemoveUser } from "../../action/userAction"
import Divider from "@mui/material/Divider"

const getData = (searchValue,setOptions) =>{
    axios.post('/works/search',{query:searchValue,autoSearch:true})
    .then((response)=>{
      setOptions(response.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

const logout = (user,dispatch,navigate) =>{
    if(!user._id){
        navigate('/user/login')
      }
    else{
        const token = localStorage.getItem('x-auth')
        const redirect = () =>{
            navigate('/')
        }
        dispatch(removeProfile())
        dispatch(startRemoveUser(token,redirect))
    }
}

const Navbar = (props) =>{
    const theme = useTheme()
    const styles = createStyles(theme)
    const location = useLocation()
    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState('0')
    const [menuDisplay,setMenuDisplay] = useState(false)
    const user = useSelector(state=>state.user)
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchValue,setSearchValue] = useState('')
    const [openSearch,setOpenSearch] = useState(false)
    const [loading,setLoading] = useState(false)
    const [options,setOptions] = useState([])
    const [timeouts,setTimeouts] = useState([])
    const dispatch = useDispatch()

    const open = Boolean(anchorEl);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        switch(location.pathname){
            case '/user/cart':
                setSelectedIndex('0')
            break;
            case '/companydetails':
                setSelectedIndex('1')
            break;
            case '/contact':
                setSelectedIndex('2')
            break;
            case '/supplier/dashboard':
                setSelectedIndex('3')
            break;
            case '/user/login':
                setSelectedIndex('4')
            break;
            case '/user/address':
                setSelectedIndex('5')
            break;
            case '/user/editProfile':
                setSelectedIndex('6')
            break;
            default:
                setSelectedIndex('9')
        }
    },[location])

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
        <Grid container>
            <Grid item name="headerContact" sx={styles.headerContact}>
                <Typography name="headerContactEmail" sx={styles.headerContactText}>support@exvate.com</Typography>
                <Typography name="headerContactMobile" sx={styles.headerContactText}>For more queries  +91 - 9048 403 999</Typography>
            </Grid>
            <Grid item sx={styles.headerNavBar}>
                <Box sx={styles.headerNavBarIcon} onClick={()=>{navigate('/')}}>
                    <img src={icon} alt='ExvateIcon' width='100%' height='100%' /> 
                </Box>
                {
                    props.displayOptions?(
                        <React.Fragment>
                            <div className={styles.searchFull}>
                                <div className={styles.search}>
                                    <Autocomplete
                                        open={openSearch}
                                        onOpen={() => {
                                            setOpenSearch(true);
                                        }}
                                        onClose={() => {
                                            setOpenSearch(false);
                                        }}
                                        classes={{
                                            root: styles.inputRoot,
                                            input: styles.inputInput,
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
                                            label={<div style={{display:'flex',alignItems:'center'}}><SearchIcon /><p>search</p></div>}
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
                            <IconButton sx={styles.headerNavBarMenu} onClick={()=>{setMenuDisplay(!menuDisplay)}}>
                                <MenuIcon />
                            </IconButton>
                            <Box sx={styles.headerNavBarNavigation}>
                                <div style={styles.NavBarButton}>
                                    <Typography id='0' sx={styles.headerNavBarText} onClick={(event)=>{user&&user._id?navigate('/user/cart'):navigate('/user/login')}}>Orders</Typography>
                                    {
                                        selectedIndex==='0'?<div style={styles.ButtonIndicator} />:null
                                    }
                                </div>
                                <div style={styles.NavBarButton}>
                                    <Typography id='1' sx={styles.headerNavBarText} onClick={(event)=>{navigate('/companydetails')}}>Company</Typography>
                                    {
                                        selectedIndex==='1'?<div style={styles.ButtonIndicator} />:null
                                    }
                                </div>
                                <div style={styles.NavBarButton}>
                                    <Typography id='2' onClick={(event) => {navigate('/contact')}} sx={styles.headerNavBarText} >Contact</Typography>
                                    {
                                        selectedIndex==='2'?<div style={styles.ButtonIndicator} />:null
                                    }
                                </div>
                                {
                                    user&&user.supplier?(
                                        <div style={styles.NavBarButton}>
                                            <Typography id='3' onClick={(event) => {navigate('/supplier/dashboard')}} sx={styles.headerNavBarText} >Supplier</Typography>
                                            {
                                                selectedIndex==='3'?<div style={styles.ButtonIndicator} />:null
                                            }
                                        </div>
                                    ):<span/>
                                }
                                {
                                    !user._id?<Button onClick={()=>{navigate('/user/login')}} className={styles.button} color="inherit" >Login</Button>:
                                    <div>
                                        <Avatar onClick={handleClickMenu}>{user.name[0]}</Avatar>
                                        <Menu
                                        id="fade-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={open}
                                        onClose={handleClose}
                                        TransitionComponent={Fade}
                                        className={styles.menu}
                                        >
                                        <MenuItem onClick={()=>{handleClose();navigate('/user/address')}}>Addresses</MenuItem>
                                        <MenuItem onClick={()=>{handleClose();navigate('/user/editProfilePassword')}}>Edit profile</MenuItem>
                                        <MenuItem onClick={()=>{handleClose();logout(user,dispatch,navigate)}}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                }
                            </Box>
                        </React.Fragment>
                    ):<span/>
                }
            </Grid>
            {
                menuDisplay?(
                    <Grid item container sx={{width:'100%',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                        <Divider sx={{color:'rgba(0,0,0,1)',height:3,width:'100%',marginBottom:'3%'}}/>
                        <Typography sx={{...styles.menuText,color:selectedIndex==='0'?theme.palette.secondary.main:'black'}} onClick={()=>{setMenuDisplay(false);user&&user._id?navigate('/user/cart'):navigate('/user/login')}}>Orders</Typography>
                        <Typography sx={{...styles.menuText,color:selectedIndex==='1'?theme.palette.secondary.main:'black'}} onClick={()=>{setMenuDisplay(false);navigate('/companydetails')}}>COMPANY</Typography>
                        <Typography sx={{...styles.menuText,color:selectedIndex==='2'?theme.palette.secondary.main:'black'}} onClick={() => {setMenuDisplay(false);navigate('/contact')}}>CONTACT</Typography>
                        {
                            !user._id?(
                                <Fragment>
                                    <Divider sx={{color:'rgba(0,0,0,1)',height:3,width:'100%',marginBottom:'3%'}}/>
                                    <Typography sx={{...styles.menuText,color:selectedIndex==='4'?theme.palette.secondary.main:'black'}} onClick={() => {setMenuDisplay(false);navigate('/user/login')}}>LOGIN</Typography>
                                </Fragment>
                            ):(
                                <Fragment>
                                    <Divider sx={{color:'rgba(0,0,0,1)',height:3,width:'100%',marginBottom:'3%'}}/>
                                    {
                                        user.supplier?(
                                            <Typography sx={{...styles.menuText,color:selectedIndex==='3'?theme.palette.secondary.main:'black'}} onClick={()=>{setMenuDisplay(false);navigate('/supplier/dashboard')}}>SUPPLIER</Typography>
                                        ):<span/>
                                    }
                                    <Typography sx={{...styles.menuText,color:selectedIndex==='5'?theme.palette.secondary.main:'black'}} onClick={()=>{setMenuDisplay(false);navigate('/user/address')}}>ADDRESSES</Typography>
                                    <Typography sx={{...styles.menuText,color:selectedIndex==='6'?theme.palette.secondary.main:'black'}} onClick={()=>{setMenuDisplay(false);navigate('/user/editProfilePassword')}}>EDIT PROFILE</Typography>
                                    <Typography sx={{...styles.menuText,color:'black'}} onClick={() => {setMenuDisplay(false);logout(user,dispatch,navigate)}}>LOGOUT</Typography>
                                </Fragment>
                            )
                        }
                    </Grid>
                ):<span/>
            }
        </Grid>
    )
}

export default Navbar