import {Fragment} from 'react'

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';

// Assets
import Lottie from 'lottie-react';
import adminAnimation from './../../../../images/lotties/42635-office-administration-isometric-concept.json';

// React Router
import { useNavigate } from 'react-router-dom';

// CSS
import './index.scss';

const tiers = [
  {
    number: '1',
    title: 'Analytics',
    description: ['See platform user analytics'],
    url: '/admin/analytics',
    buttonText: 'go',
    buttonVariant: 'outlined',
  },

  {
    number: '2',
    title: 'Management',
    description: ['Manage user accounts'],
    url: '/admin/database',
    buttonText: 'go',
    buttonVariant: 'outlined',
  },
];

function AdminHomeContent() {
  //move to new page
  const navigate = useNavigate();

  return (
    <Fragment>
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <div className="dashboard_admin_animation">
          <Lottie animationData={adminAnimation} />
        </div>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Admin Panel
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          Welcome back
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid item key={tier.number} xs={12} sm={12} md={6}>
              <Card>
                <CardHeader
                  title={tier.number}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                    >
                      {tier.title}
                    </Typography>
                  </Box>
                  {tier.description.map((line) => (
                    <Typography
                      variant="subtitle1"
                      align="center"
                      key={line}
                    >
                      {line}
                    </Typography>
                  ))}
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    onClick={() => {
                      navigate(tier.url);
                    }}
                    fullWidth
                    variant={tier.buttonVariant}
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Fragment>
  );
}

export default function AdminHome() {
  return <AdminHomeContent />;
}
