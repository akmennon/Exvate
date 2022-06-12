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

const Navbar = (props) =>{
    const theme = useTheme()
    const styles = createStyles(theme)
    const location = useLocation()
    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState('0')
    const [menuDisplay,setMenuDisplay] = useState(false)

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
                <Box sx={styles.headerNavBarNavigation}>
                    <div style={styles.NavBarButton}>
                        <Typography id='0' sx={styles.headerNavBarText} onClick={(event)=>{navigate('/')}}>Home</Typography>
                        {
                            selectedIndex==='0'?<div style={styles.ButtonIndicator} />:null
                        }
                    </div>
                    <div style={styles.NavBarButton}>
                        <Typography id='1' sx={styles.headerNavBarText} onClick={(event)=>{navigate('/products')}}>Products</Typography>
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
                        <Typography id='3' onClick={(event) => {navigate('/faq')}} sx={styles.headerNavBarText} >FAQ</Typography>
                        {
                            selectedIndex==='3'?<div style={styles.ButtonIndicator} />:null
                        }
                    </div>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Navbar