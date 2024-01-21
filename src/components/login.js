// src/components/LoginPage.js

import React from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';
import hospitalImage from '../styles/logo.jpg'; 
import '../styles/login.css'

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="md">
      <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginTop: '100px' }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <img src={hospitalImage} alt="Hospital" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" style={{ color: blue[800], marginBottom: '20px', animation: 'fadeIn 3s' }}>
              AVANI HOSPITAL MANAGEMENT 
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: blue[800] }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
