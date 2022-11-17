import {useState} from 'react';

// MUI Components
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

// Router
import { Link as RouterLink } from "react-router-dom";

// Toast
import { toast } from 'react-toastify';

function Login() {
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    setLoading(true);

    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      email: data.get('email'),
      password: data.get('password')
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
    
    const userData = {
      email: formData.email,
      password: formData.password
    }

    signInWithEmailAndPassword(auth, userData.email, userData.password)
      .then(() => {
        toast.success("Successfully logged in");
      })
      .catch((error) => {
        toast.error(error.message)
        setLoading(false)
      });
    setLoading(false);
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
          Sign In
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
          </Grid>
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-end"
            spacing={2}
          >
            <Link component={RouterLink} to="/auth/reset" variant="body2">
              Reset password
            </Link>
            <Link component={RouterLink} to="/auth/register" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;