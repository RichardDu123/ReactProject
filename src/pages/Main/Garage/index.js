// React
import { useEffect, useState } from 'react';

// MUI
import { Backdrop, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// Firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  addDoc,
  where,
  updateDoc,
  increment,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';

// Context
import { useAuthController } from '../../../context';

// Components
import DashboardGarageCanvas from '../../../components/DashBoardGarageCanvas';
import HomePageGarageItemList from './HomePageGarageItemList';

// Toast
import { toast } from 'react-toastify';

// React Router
import { useNavigate } from 'react-router-dom';

// Util
import queryString from 'query-string';
import moment from 'moment';

// Assets
import Lottie from 'lottie-react';
import emptyImage from './../../../images/lotties/2705-image-loading.json';

// CSS
import './index.scss';

function Garage() {
  const [authController, ] = useAuthController();
  const { user } = authController;
  const [canvasSize] = useState({ width: 800, height: 600 });
  const [isLoading, setIsLoading] = useState(false);
  const [, setItems] = useState([]);
  const [color, setColor] = useState('disabled');
  const [data, setData] = useState([]);
  const naviagte = useNavigate();
  const dbRef = collection(db, 'favourites');
  const [garage, setGarage] = useState({
    name: '',
    itemLimit: 5,
    garageItems: [],
    featured: false,
    favouritesNum: 0,
    searchName: '',
    url: null,
  });
  const { name, url, description } = garage;
  const [garageItems, setGarageItems] = useState([]);
  const id = queryString.parse(window.location.search).id;

  const handleStarClick = async () => {
    if (!user) {
      naviagte('/auth/login');
    }
    setIsLoading(true);
    const garageRef = doc(db, 'garage', id);
    if (color === 'disabled') {
      await addDoc(dbRef, {
        userId: user.uid,
        garageId: id,
        dt: moment().format(),
      });
      await updateDoc(garageRef, { favouritesNum: increment(1) })
        .then(() => {
          setColor('success');
          toast.success('Successflly add to your favourites.');
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      const q = query(
        collection(db, 'favourites'),
        where('userId', '==', user.uid),
        where('garageId', '==', id)
      );
      const res = await getDocs(q);
      await deleteDoc(doc(db, 'favourites', res.docs[0].id));
      await updateDoc(garageRef, { favouritesNum: increment(-1) })
        .then(() => {
          setColor('disabled');
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
    setIsLoading(false);
  };

  //if login, then get the favourite list of the user
  useEffect(() => {
    let mounted = true;
    async function getFavorites() {
      return await getDocs(
        query(collection(db, 'favourites'), where('userId', '==', user.uid))
      );
    }
    if (user) {
      getFavorites().then((r) => {
        if (mounted) {
          setData(r.docs);
        }
      });
    }
    return () => (mounted = false);
    // eslint-disable-next-line
  }, [user]);
  //set the start color
  useEffect(() => {
    if (
      user &&
      data
        .map((item) => {
          return item.data().garageId;
        })
        .some((item) => {
          return item === id;
        })
    ) {
      setColor('success');
    } else {
      setColor('disabled');
    }
  }, [data, id, user]);

  const getItemsAndGarage = async () => {
    setIsLoading(true);
    try {
      const q = await query(collection(db, 'item'), where('uid', '==', id));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          ...data,
          id: doc.id,
        });
      });
      setItems(items);
    } catch (error) {
      toast.error('failed to get items');
    }

    try {
      const docRef = doc(db, 'garage', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGarage(docSnap.data());
      } else {
        toast.error('No garage found');
      }
    } catch (error) {
      toast.error('Failed to get garage');
    }

    try {
      const q = await query(
        collection(db, 'garageItem'),
        where('garageId', '==', id)
      );
      const querySnapshot = await getDocs(q);
      const garageItems = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        garageItems.push({
          ...data,
          id: doc.id,
        });
      });
      setGarageItems(garageItems);
    } catch (error) {
      toast.error("failed to get garage's items");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    //call service from db
    getItemsAndGarage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="garage_body">
        <div className="garage_body_header">
          <div className="garage_body_header_img">
            {url ? (
              <img src={url} alt="garage logo"></img>
            ) : (
              <Lottie animationData={emptyImage} />
            )}
          </div>
          <div className="garage_body_header_text">
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
        </div>
        <div className="garage_body_bottom">
          <span className="subTitle">{color === "disabled" ? "Favourite" : "Unfavorite"}</span>
          <StarIcon color={color} fontSize="large" onClick={handleStarClick} />
        </div>
      </div>
      <DashboardGarageCanvas
        garageName={name}
        items={garageItems}
        canvasSize={canvasSize}
      ></DashboardGarageCanvas>
      <HomePageGarageItemList
        items={garageItems}
        canvasItems={garageItems}
        itemLimit={10}
      ></HomePageGarageItemList>
    </>
  );
}
export default Garage;
