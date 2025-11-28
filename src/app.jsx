import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './componentes/NavBar';
import PokemonCard from './componentes/PokemonCards';
import { Container, Grid } from '@mui/material';

function App() {
  return (
    <div>
      <NavBar />;
      <Container maxWidth="false">
        <Grid container>
          <Grid item xs={3}>
          <PokemonCard />
          </Grid>
          <Grid item xs={3}>
          <PokemonCard />
          </Grid>
          <Grid item xs={3}>
          <PokemonCard />
          </Grid>
          <Grid item xs={3}>
          <PokemonCard />
          </Grid>
        </Grid>
        
      </Container>
      
    </div>
    

  );
   
  
}

export default App
