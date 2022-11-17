// React
import { useEffect, useState } from 'react';

// MUI
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
  Grid,
  Input,
  TextField,
} from '@mui/material';

// Components
import DashboardGarageCanvas from '../../../components/DashBoardGarageCanvas';
import DashboardGarageItemList from '../../../components/DashBoardGarageItemList';

// Utils
import Resizer from 'react-image-file-resizer';
import { v4 as uuidv4 } from 'uuid';
import { PhotoFilter } from '@mui/icons-material';

// CSS
import './index.scss';

// Assets
import Lottie from 'lottie-react';
import emptyImage from './../../../images/lotties/2705-image-loading.json';

// Firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../../../firebase';

// Context
import { useAuthController } from '../../../context';

// Toast
import { toast } from 'react-toastify';

function Garage() {
  const [authController] = useAuthController();
  const { user } = authController;
  const [editable, setEditable] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [garage, setGarage] = useState({
    name: '',
    description: '',
    itemLimit: 5,
    featured: false,
    favouritesNum: 0,
    searchName: '',
    url: null,
  });
  const [garageItems, setGarageItems] = useState([]);
  const [firstClicks, setFirstClick] = useState({
    name: false,
    description: false,
  });
  const [image, setImage] = useState(null);

  const { itemLimit, name, description, url } = garage;
  const removeSpace = (string) => {
    return string.replace(/\s/g, '');
  };
  const handleChangeName = (e) => {
    if (e.target.value.length > 10) {
      return;
    }
    setGarage({
      ...garage,
      name: e.target.value,
      searchName: removeSpace(e.target.value).toLowerCase(),
    });
  };

  const handleChangeDescription = (e) => {
    if (e.target.value.length > 250) {
      return;
    }
    setGarage({ ...garage, description: e.target.value });
  };

  const addItemIntoCanvas = (item) => {
    if (itemLimit - garageItems.length > 0) {
      const newGarageItems = [
        ...garageItems,
        {
          itemId: item.id,
          url: item.url,
          canvasItemId: uuidv4(),
          position: [0, 1, 0],
          rotation: [0, 0, 0],
          scale: [10, 10, 0.1],
        },
      ];
      setGarageItems(newGarageItems);
    }
  };

  const handleDelete = (id) => {
    const item = garageItems.find((each) => each.canvasItemId === id);
    const index = garageItems.indexOf(item);
    const newList = [...garageItems];
    newList.splice(index, 1);
    setGarageItems(newList);
  };

  const handleMove = (canvasItemId, pos, ro, sc) => {
    setGarageItems(
      garageItems.map((item) => {
        const position =
          item.canvasItemId === canvasItemId ? pos : item.position;
        const rotation =
          item.canvasItemId === canvasItemId ? ro : item.rotation;
        const scale = item.canvasItemId === canvasItemId ? sc : item.scale;
        return {
          ...item,
          isDragging: true,
          position,
          rotation,
          scale,
        };
      })
    );
  };

  const displayEditingImage = () => {
    if (image) {
      return <img src={URL.createObjectURL(image)} alt="garage logo"></img>;
    } else if (url) {
      return <img src={url} alt="garage logo"></img>;
    } else {
      return <Lottie animationData={emptyImage} />;
    }
  };

  const handleConfirmChange = async () => {
    //call service

    if (
      (url === null && image === null) ||
      name.length === 0 ||
      description.length === 0
    ) {
      return;
    }
    setIsLoading(true);

    try {
      //delete all garageitems
      const q = await query(
        collection(db, 'garageItem'),
        where('garageId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docu) => {
        await deleteDoc(doc(db, 'garageItem', docu.id));
      });

      garageItems.forEach(async (garageItem) => {
        const newGarageItem = { ...garageItem, garageId: user.uid };
        delete newGarageItem.canvasItemId;
        await addDoc(collection(db, 'garageItem'), newGarageItem);
      });

      var newUrl = url;

      if (image !== null) {
        const storage = getStorage();
        const storageRef = ref(
          storage,

          `/garageLogo/${user.uid}/${image.name}`
        );

        const snapshot = await uploadBytes(storageRef, image);
        newUrl = await getDownloadURL(snapshot.ref);
      }

      //add userName in garage for avatar dispaly
      const profileRef = doc(db, 'profile', user.uid);
      const docSnap = await getDoc(profileRef);
      let userName = '';
      if (docSnap.exists() && docSnap.data().userName) {
        userName = docSnap.data().userName;
      }

      const garageRef = doc(db, 'garage', user.uid);
      await setDoc(garageRef, { ...garage, url: newUrl, userName });
      setGarage({ ...garage, url: newUrl });

      toast.success('Garage updated');
    } catch (error) {
      toast.error(error);
    }

    setEditable(false);
    setIsLoading(false);
  };

  const handleSwitchToChange = () => {
    setEditable(true);
  };

  const handleCancelChange = () => {
    getItemsAndGarage();
    setEditable(false);
  };

  const handleChangeImage = async (e) => {
    setImage(e.target.files[0]);
    try {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        e.target.files[0].type,
        300,
        0,
        (url) => {
          const image = new File([url], e.target.files[0].name);
          setImage(image);
        },
        'file',
        300,
        300
      );
    } catch (err) {
      toast.error('resize image error');
    }
  };

  const getItemsAndGarage = async () => {
    setIsLoading(true);
    setGarage({
      name: '',
      description: '',
      itemLimit: 5,
      featured: false,
      favouritesNum: 0,
      searchName: '',
      url: null,
    });
    setItems([]);
    try {
      const q = await query(
        collection(db, 'item'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach(async (doc) => {
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
      const docRef = doc(db, 'garage', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGarage(docSnap.data());
      } else {
        toast.error('No garage found, create one');
      }
    } catch (error) {
      toast.error('Failed to get garage');
    }

    try {
      const q = await query(
        collection(db, 'garageItem'),
        where('garageId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const garageItems = [];
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();

        garageItems.push({
          ...data,
          canvasItemId: uuidv4(),
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
    // call service to get items
    getItemsAndGarage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (editable) {
    return (
      <div className="dashboard_garage">
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="dashboard_garage_header">
          <div className="buttons">
            <Button variant="outlined" onClick={handleCancelChange}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmChange}
              disabled={
                (url === null && image === null) ||
                name.length === 0 ||
                description.length === 0
              }
            >
              Confirm
            </Button>
          </div>
        </div>
        <div className="dashboard_garage_body">
          <label className="dashboard_garage_body_img">
            {displayEditingImage()}
            <Input
              inputProps={{ accept: 'image/png, image/jpeg' }}
              id="dashboard_garage_body_img_input"
              type="file"
              onChange={handleChangeImage}
            />
            <Fab component="span" id="dashboard_garage_body_img_icon">
              <PhotoFilter />
            </Fab>
            <p>image's width will be resized automatically if it is too big</p>
          </label>
          <div className="dashboard_garage_body_text">
            <Grid container gap={5} id="dashboard_garage_body_textForm">
              <Grid item xs={12}>
                <TextField
                  fullWidth={true}
                  variant="outlined"
                  label="name"
                  name="name"
                  placeholder="at least 1 and at most 20 characters"
                  value={name}
                  onClick={() => setFirstClick({ ...firstClicks, name: true })}
                  error={firstClicks.name && name.length === 0}
                  onChange={handleChangeName}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={4}
                  fullWidth={true}
                  value={description}
                  label="description"
                  id="dashboard_garage_textForm_textarea"
                  placeholder="descrition should be at least 1 and at most 250 characters"
                  //error={firstClicks.description && description.length === 0}
                  onClick={() =>
                    setFirstClick({ ...firstClicks, description: true })
                  }
                  onChange={handleChangeDescription}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <DashboardGarageCanvas
          garageName={name}
          items={garageItems}
          handleMove={handleMove}
          editable={editable}
          handleDelete={handleDelete}
        ></DashboardGarageCanvas>
        <DashboardGarageItemList
          items={items}
          canvasItems={garageItems}
          itemLimit={itemLimit}
          addItemIntoCanvas={addItemIntoCanvas}
        ></DashboardGarageItemList>
      </div>
    );
  }

  return (
    <div className="dashboard_garage">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="dashboard_garage_header">
        <Button variant="contained" onClick={handleSwitchToChange}>
          Edit
        </Button>
      </div>

      <div className="dashboard_garage_body">
        <div className="dashboard_garage_body_img">
          {url ? (
            <img src={url} alt="garage logo"></img>
          ) : (
            <Lottie animationData={emptyImage} />
          )}
        </div>
        <div className="dashboard_garage_body_text">
          <h1>{name}</h1>
          <p>{description}</p>
        </div>
      </div>

      <DashboardGarageCanvas
        garageName={name}
        items={garageItems}
        handleMove={handleMove}
        handleDelete={handleDelete}
        editable={editable}
      ></DashboardGarageCanvas>
    </div>
  );
}
export default Garage;
