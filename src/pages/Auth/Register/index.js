import {useState} from 'react';

// MUI Components
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

// Router
import { Link as RouterLink } from "react-router-dom";

// Toast
import { toast } from 'react-toastify';

function Register() {
  
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = (event) => {
    setLoading(true);

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirm-password')
    }

    if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))){
      toast.error('Invalid email');
      setLoading(false);
      return
    }
    if (formData.password.length <= 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password does not match');
      setLoading(false);
      return
    } 
    if (!agree) {
      toast.error('Agree to the terms and conditions');
      setLoading(false);
      return
    } else {
      const userData = {
        email: formData.email,
        password: formData.password
      }

      createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then(() => {
          toast.success("Account created");
        })
        .catch((error) => {
          toast.error(error.message)
          setLoading(false)
        });
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirm-password"
                label="Confirm password"
                type="password"
                id="confirm-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox 
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  value="agreeTerms"
                  color="primary" 
                />}
                label="I agree to the terms and conditions."
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/auth/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;