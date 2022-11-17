import {useState} from 'react';

// MUI Components
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from "@mui/material/Divider";

// Firebase
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";

// Toast
import { toast } from 'react-toastify';

function Reset() {

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    setLoading(true);

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');

    if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))){
      toast.error('Invalid email');
      setLoading(false);
      return
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess(true);
      })
      .catch(() => {
        toast.error("No account found");
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
          Reset Password
        </Typography>
        <Box sx={{ width: '100%'}}>
          <Divider variant="middle"/>
        </Box>
        { success ?
          <Typography component="p" variant="p" align="center">
            Password reset link has been sent.
          </Typography>
          :
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <LoadingButton
              loading={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset
            </LoadingButton>
          </Box>
        }
      </Box>
    </Container>
  );
}

export default Reset;