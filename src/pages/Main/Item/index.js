import { Backdrop, CircularProgress, Grid } from '@mui/material';
import { useState } from 'react';
import Lottie from 'lottie-react';
import emptyImage from './../../../images/lotties/2705-image-loading.json';
import './index.scss';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../../firebase';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { useEffect } from 'react';

function Item() {
  const id = queryString.parse(window.location.search).id;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: null,
  });

  const getItem = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(db, 'garageItem', id);
      const docSnap = await getDoc(docRef);
      const docRef2 = doc(db, 'item', docSnap.data().itemId);
      const docSnap2 = await getDoc(docRef2);
      setFormData(docSnap2.data());
    } catch (error) {
      toast.error('failed to get items');
    }
    setIsLoading(false);
  };
  useEffect(() => {
    //call service from db
    getItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <label className="singleItem_imgContainer">
        {formData.url ? (
          <img src={formData.url} alt="garage logo"></img>
        ) : (
          <Lottie animationData={emptyImage} />
        )}
      </label>

      <Grid container gap={5} id="singleItem_textForm">
        <Grid item xs={12}>
          <h1>{formData.name}</h1>
        </Grid>
        <Grid item xs={12}>
          <p>{formData.description}</p>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default Item;
