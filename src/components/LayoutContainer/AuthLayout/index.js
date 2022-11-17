// React
import {useMemo} from 'react';

// MUI Components
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Context
import {useAppController} from "../../../context";

function AuthLayout({children}) {

  const [controller, ] = useAppController();
  const {darkMode} = controller;

  // Create theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {children}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AuthLayout;