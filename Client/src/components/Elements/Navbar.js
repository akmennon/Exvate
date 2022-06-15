import Grid from "@mui/material/Grid"
import createStyles from '../../styles/headerContact'
import {useTheme} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {useNavigate,useLocation} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import icon from '../resources/images/exvateLogo.svg'
import {useState,useEffect} from 'react'
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

const getData = (searchValue,setOptions) =>{
    const token = localStorage.getItem('x-auth')
    axios.post('/works/search',{query:searchValue,autoSearch:true},{
      headers:{
        'x-auth':token
      }
    })
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
    let displayOption = true
    const dispatch = useDispatch()

    const open = Boolean(anchorEl);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        if(location.pathname==='/'){
            setSelectedIndex('0')
        }
        else if(location.pathname.includes('/products')) {
            setSelectedIndex('1')
        }
        else if(location.pathname==='/faq'){
            setSelectedIndex('3')
        }
    },[location])

    useEffect(()=>{
        displayOption = props.displayOption
    },[props.displayOption])

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
                <IconButton sx={styles.headerNavBarMenu} onClick={()=>{setMenuDisplay(!menuDisplay)}}>
                    <MenuIcon />
                </IconButton>
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
                <Box sx={styles.headerNavBarNavigation}>
                    <div style={styles.NavBarButton}>
                        <Typography id='0' sx={styles.headerNavBarText} onClick={(event)=>{navigate('/')}}>Home</Typography>
                        {
                            selectedIndex==='0'?<div style={styles.ButtonIndicator} />:null
                        }
                    </div>
                    <div style={styles.NavBarButton}>
                        <Typography id='1' sx={styles.headerNavBarText} onClick={(event)=>{navigate('/products')}}>My Orders</Typography>
                        {
                            selectedIndex==='1'?<div style={styles.ButtonIndicator} />:null
                        }
                    </div>
                    <div style={styles.NavBarButton}>
                        <Typography id='2' onClick={(event) => {navigate('/faq')}} sx={styles.headerNavBarText} >Contact</Typography>
                        {
                            selectedIndex==='2'?<div style={styles.ButtonIndicator} />:null
                        }
                    </div>
                    <div style={styles.NavBarButton}>
                        <Typography id='3' onClick={(event) => {navigate('/faq')}} sx={styles.headerNavBarText} >Supplier</Typography>
                        {
                            selectedIndex==='3'?<div style={styles.ButtonIndicator} />:null
                        }
                    </div>
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
            </Grid>
        </Grid>
    )
}

export default Navbar