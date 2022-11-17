// React
import { Fragment, useState, useEffect } from 'react';

// Firebase
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';

//Context
import { useAuthController } from '../../../context';

// Components
import { Backdrop, CircularProgress } from '@mui/material';
import GarageList from '../../Main/Home/garageList';

function Favorites() {
  const [authController] = useAuthController();
  const { user } = authController;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function getFavorites() {
      setIsLoading(true);
      const res = await getDocs(
        query(collection(db, 'favourites'), where('userId', '==', user.uid))
      );
      const favList = [];
      for (const document of res.docs) {
        const garageId = document.data().garageId;
        const docRef = doc(db, 'garage', garageId);
        const docSnap = await getDoc(docRef);

        favList.push({ ...docSnap.data(), id: garageId });
      }
      return favList;
    }

    getFavorites().then((r) => {
      if (mounted) {
        setData(r);
        setIsLoading(false);
      }
    });

    return () => (mounted = false);
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Your favorites</h1>
      <div className="feturedGarage">
        <GarageList items={data}></GarageList>
      </div>
    </Fragment>
  );
}
export default Favorites;
