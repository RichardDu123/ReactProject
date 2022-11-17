import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Backdrop, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
//database
import { db } from './../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import queryString from 'query-string';
import './index.scss';
function Garages() {
  const [garages, setGarages] = useState([]);
  const { key } = queryString.parse(window.location.search);
  const [searchString, setSearchString] = useState(key);
  const [isLoading, setIsLoading] = useState(false);

  const naviagte = useNavigate();
  const removeSpace = (string) => {
    return string.replace(/\s/g, '');
  };
  const searchGarage = async () => {
    setIsLoading(true);
    let q;
    if (!searchString) {
      q = await query(collection(db, 'garage'));
    } else {
      const searchValue = removeSpace(searchString).toLowerCase();
      const minName = searchValue.substr(0, searchString.length - 1);
      const maxName = searchValue + 'zzzzzzzzzzzzzzzzzzzzzzzz';
      q = await query(
        collection(db, 'garage'),
        where('searchName', '>=', minName),
        where('searchName', '<=', maxName)
      );
    }
    const querySnapshot = await getDocs(q);
    const garages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      garages.push({
        ...data,
        id: doc.id,
      });
    });
    setGarages(garages);
    setIsLoading(false);
  };
  const getGarages = async () => {
    setIsLoading(true);
    const q = await query(collection(db, 'garage'));
    const querySnapshot = await getDocs(q);
    const garages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      garages.push({
        ...data,
        id: doc.id,
      });
    });
    setGarages(garages);
    setIsLoading(false);
  };
  const handleGarageClick = (id) => {
    naviagte(`/garage?id=${id}`);
  };
  useEffect(() => {
    //call service from db
    getGarages();
  }, []);
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Garage List</h1>
      <Paper
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Garages"
          inputProps={{ 'aria-label': 'search garages' }}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <IconButton
          type="button"
          sx={{ p: '10px' }}
          aria-label="search"
          onClick={searchGarage}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <div className="garagesContainer">
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          className="garagesContainer_list"
        >
          {garages.map((item) => {
            return (
              <ListItem
                key={item.id}
                onClick={() => {
                  handleGarageClick(item.id);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={
                      item.userName
                        ? `https://avatars.dicebear.com/api/adventurer/${item.userName}.svg`
                        : ''
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.description}
                />
              </ListItem>
            );
          })}
        </List>
      </div>
    </>
  );
}
export default Garages;
