import React from 'react';
import Router from './config/router';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';

const theme = createTheme({
  typography:{
    fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif'
  },
  palette:{
    primary:{
      main:'#449EDA',
      dark:'#0F3784'
    },
    secondary:{
      main:'#4DAF77'
    },
    background:{
      paper:'#F4F9FC'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 768,
      lg: 1366,
      xl: 1920,
    }
  }
})

const customTheme = {
  ...theme,
  typography:{
    ...theme.typography,
    h3:{
      ...theme.typography.h4,
      fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif',
      minHeight:'0vw',
      fontSize:'clamp(1.5rem,2.8vw,2.5rem)'
    },
    h4:{
      ...theme.typography.h4,
      fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif',
      minHeight:'0vw',
      fontSize:'clamp(1.3rem,2.4vw,2rem)'
    },
    h5:{
      ...theme.typography.h5,
      fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif',
      minHeight:'0vw',
      fontSize:'clamp(1.2rem,1.5vw,2rem)'
    },
    h6:{
      ...theme.typography.h6,
      fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif',
      minHeight:'0vw',
      fontSize:'clamp(1rem,1.2vw,1.2rem)'
    },
    subtitle2:{
      ...theme.typography.subtitle2,
      fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif',
      minHeight:'0vw'
    },
    body1:{
      ...theme.typography.body1,
      fontFamily:'Montserrat, Roboto, Helvetica, Arial, sans-serif',
      minHeight:'0vw',
      fontSize:'clamp(0.8rem,1.3vw,1rem)'
    }
  }
}

function App (props){

  return(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={customTheme}><Router/></ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App;
