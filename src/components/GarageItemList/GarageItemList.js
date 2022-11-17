import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Card,
} from '@mui/material';
import Lottie from 'lottie-react';
import emptyList from '../../images/lotties/629-empty-box.json';
function GarageItemList({ items, openModalToDeleteItem, setItem }) {
  if (!items || items.length === 0) {
    return (
      <Grid container spacing={2}>
        <Grid item sm={8} margin="auto">
          <Lottie animationData={emptyList} />
          <Typography variant="h2" textAlign={'center'}>
            There are no items
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
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
            </CardActionArea>
            <CardActions className="dashboard__item__buttons">
              <Button
                size="small"
                color="error"
                onClick={() => {
                  openModalToDeleteItem(item);
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
export default GarageItemList;
