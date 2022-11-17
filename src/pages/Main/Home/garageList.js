// MUI
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Card,
} from '@mui/material';

// React Router
import { useNavigate } from 'react-router-dom';

// Assets
import Lottie from 'lottie-react';
import emptyList from './../../../images/lotties/629-empty-box.json';
import StarIcon from '@mui/icons-material/Star';

// CSS
import './index.scss';

function GarageList({ items }) {
  const naviagte = useNavigate();
  const handleGarageClick = (id) => {
    naviagte(`/garage?id=${id}`);
  };
  if (!items || items.length === 0) {
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} margin="auto">
          <Lottie animationData={emptyList} />
          <Typography variant="h2" textAlign={'center'}>
            There are no garages
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container spacing={8}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card
            onClick={() => {
              handleGarageClick(item.id);
            }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                src={item.url}
                alt={item.description}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <div className="star">
                <span>{item.favouritesNum}</span>
                <StarIcon color="success" />
              </div>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
export default GarageList;
