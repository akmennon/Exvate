import {alpha} from '@mui/material/styles';

/*
xs - 0
sm - 375
md - 768
lg - 1366
xl - 1920^
*/

const headerContactStyles = (theme) =>{
    const styles = {
        headerContact:{
            width:'100%',
            backgroundColor:theme.palette.primary.dark,
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            paddingLeft:'7.5%',
            paddingRight:'7.5%',
            [theme.breakpoints.between('sm','lg')]:{
                height:30
            },
            [theme.breakpoints.down('sm')]:{
                height:20
            },
            [theme.breakpoints.up('lg')]:{
                height:40
            }
        },
        headerContactText:{
            color:'#FFFFFF',
            [theme.breakpoints.between('sm','lg')]:{
                fontSize:10
            },
            [theme.breakpoints.down('sm')]:{
                fontSize:9
            },
            [theme.breakpoints.up('lg')]:{
                fontSize:12
            }
        },
        headerNavBarNavigation:{
            alignItems:'center',
            display:'flex',
            width:385,
            height:19,
            justifyContent:'space-between',
            [theme.breakpoints.down('lg')]:{
                display:'none'
            }
        },
        NavBarButton:{
            position:'relative',
            justifyContent:'center',
            display:'flex'
        },
        headerNavBarText:{
            '&:hover':{
                cursor:'pointer'
            }
        },
        ButtonIndicator:{
            height:4,
            width:20,
            backgroundColor:theme.palette.secondary.main,
            position:'absolute',
            marginTop:30
        },
        headerNavBarMenu:{
            alignItems:'center',
            justifyContent:'center',
            [theme.breakpoints.up('lg')]:{
                display:'none'
            },
            [theme.breakpoints.between('sm','lg')]:{
                display:'flex',
                width:20,
                height:16
            },
            [theme.breakpoints.down('sm')]:{
                display:'flex',
                width:16,
                height:11
            }
        },
        headerNavBar:{
            width:'100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor:'#FFFFFF',
            paddingLeft:'7.5%',
            paddingRight:'7.5%',
            [theme.breakpoints.between('sm','lg')]:{
                height:60
            },
            [theme.breakpoints.down('sm')]:{
                height:40
            },
            [theme.breakpoints.up('lg')]:{
                height:80
            }
        },
        headerNavBarIcon:{
            '&:hover':{
                cursor:'pointer'
            },
            [theme.breakpoints.between('sm','lg')]:{
                width:166,
                height:48.29
            },
            [theme.breakpoints.down('sm')]:{
                width:105.378,
                height:30.836
            },
            [theme.breakpoints.up('lg')]:{
                width:217.07,
                height:63.5075
            }
        },
        menu:{
            marginTop:theme.spacing(5)
        },
        button:{
          display:'block'
        },
        searchFull:{
          flexGrow:0.8,
          padding:theme.spacing(0,2)
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
        }
    }

    return styles
}

export default headerContactStyles