import React from 'react';
import Router from './config/router';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';

const theme = createTheme()

function App (props){

  return(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}><Router/></ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App;
