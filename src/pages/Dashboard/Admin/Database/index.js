// React
import { useEffect, useState } from 'react';

// MUI
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  CircularProgress,
  Backdrop,
  InputBase,
  IconButton,
} from '@mui/material';

// Firebase
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './../../../../firebase/index';

// Context
import {useAuthController} from "../../../../context";

// Toast
import {toast} from 'react-toastify';

function Database() {
  const [authController] = useAuthController();
  const {user} = authController;

  // Get user profile from database
  // Collection
  const [data, setData] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get User data List from firebase
  async function getUserData(searchWord) {
    try {
      setIsLoading(true);
      let res = null;
      if (searchWord.length === 0) {
        res = await getDocs(query(collection(db, 'profile')));
      } else {
        res = await getDocs(
          query(collection(db, 'profile'), where('UID', '==', searchWord))
        );
        toast.error(res);
      }
      let UserData = [];
      if (res) {
        for (const document of res.docs) {
          UserData.push({ ...document.data(), id: document.id });
        }
      }
      setData(UserData.filter((item) => item.UID !== user.uid));
    } catch (error) {
      toast.error(error);
    }
    setIsLoading(false);
  }

  //Loading User List data for Table
  useEffect(() => {
    getUserData(searchWord);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search Button Event
  function SearchChange() {
    getUserData(searchWord);
  }

  //Update user data-input UID
  const replaceUser = (newUser) => {
    if (newUser) {
      const newData = [...data];
      const user = newData.find((each) => each.UID === newUser.UID);
      const index = newData.indexOf(user);
      // find the index item, delete it and use newUser replace
      newData.splice(index, 1, newUser);
      setData(newData);
    }
  };

  // locked&unlocked Change Event
  async function lockedChange(user) {
    try {
      const docRef = doc(db, 'profile', user.UID);
      await setDoc(docRef, { ...user, locked: !user.locked });
      replaceUser({ ...user, locked: !user.locked });
      toast.success(!user.locked ? "User locked" : "User unlocked")
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth={'xl'}>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search user ID"
                value={searchWord}
                onChange={(e) => {
                  setSearchWord(e.target.value);
                }}
              />
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={SearchChange}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
        <div style={{ height: 400, width: '100%', marginTop: '10px' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>UID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.UID}
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={row.locked}
                            onChange={() => {
                              lockedChange(row);
                            }}
                          />
                        }
                        label={row.locked ? 'locked' : 'unlocked'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </>
  );
}
export default Database;
