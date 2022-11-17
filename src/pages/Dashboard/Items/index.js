// React
import { useEffect, useState } from 'react';

// MUI
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal
} from '@mui/material';

// Components
import ItemList from '../../../components/GarageItemList/GarageItemList';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './../../../firebase';

// React router
import { useNavigate } from 'react-router-dom';

// Context
import { useAuthController, useAppController } from '../../../context';

// Toast
import { toast } from 'react-toastify';

// CSS
import './index.scss';

function Items() {
  const [authController, ] = useAuthController();
  const { user } = authController;
  const [appController, ] = useAppController();
  const { darkMode } = appController;

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [deletedItem, setDeletedItem] = useState(null);
  const navigate = useNavigate();

  const deleteItem = async () => {
    // call function to delete

    setIsLoading(true);
    const item = deletedItem;
    setDeletedItem(null);
    try {
      // Delete garage item
      const q = query(collection(db, 'garageItem'), where('itemId', '==', deletedItem.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(element => {
        deleteDoc(doc(db, 'garageItem', element.id));
      });

      // Delete item
      await deleteDoc(doc(db, 'item', deletedItem.id));
      const newItems = [...items];
      const index = newItems.indexOf(item);
      newItems.splice(index, 1);
      setItems(newItems);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const openModalToDeleteItem = (item) => {
    setDeletedItem(item);
  };

  const getGarageItems = async () => {
    setIsLoading(true);
    const q = query(collection(db, 'item'), where('uid', '==', user.uid));
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
    setIsLoading(false);
  };
  useEffect(() => {
    // call service to get items
    getGarageItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={2}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        open={deletedItem !== null}
        onClose={() => {
          setDeletedItem(null);
        }}
        sx={{}}
      >
        <Box className={darkMode ? "dashboard_items_modal-dark" : "dashboard_items_modal"}>
          <p>Remove item?</p>
          <Button variant="contained" onClick={deleteItem}>
            Confirm
          </Button>
        </Box>
      </Modal>
      <Grid item xs={12} className="dashboard_items_header">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            navigate('/dashboard/new-item');
          }}
        >
          Add Item
        </Button>
      </Grid>
      <ItemList
        items={items}
        openModalToDeleteItem={openModalToDeleteItem}
      ></ItemList>
    </Grid>
  );
}
export default Items;
