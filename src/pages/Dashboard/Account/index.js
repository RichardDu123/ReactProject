// React
import { useEffect, useState, useCallback } from 'react';

// MUI
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

// Assets
import Lottie from 'lottie-react';
import nullAvatar from './../../../images/lotties/28611-avatar.json';

// CSS
import './index.scss';

// Context
import { useAuthController } from '../../../context';

// Firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';

// Toast
import { toast } from 'react-toastify';

// Debounce
import { debounce } from 'throttle-debounce';

function Account() {
  const [authController] = useAuthController();
  const { user } = authController;
  const [profile, setProfile] = useState({
    userName: '',
  });
  const [userName, setUserName] = useState('');
  const [lottieName, setLottieName] = useState('');
  const [firstClick, setFirstClick] = useState(false);
  const [userNameExist, setUserNameExist] = useState(false);
  const [checkPending, setCheckPending] = useState(false);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFunc = useCallback(
    debounce(1000, (value) => {
      checkUserNameExist(value);
      setLottieName(value);
    }),
    []
  );

  const changeUseName = (e) => {
    setUserName(e.target.value);
    debounceFunc.cancel({ upcomingOnly: true });
    debounceFunc(e.target.value);
  };

  const checkUserNameExist = async (userName) => {
    setCheckPending(true);
    if (userName && userName.length > 0) {
      const q = await query(
        collection(db, 'profile'),
        where('userName', '==', userName)
      );
      const querySnapshot = await getDocs(q);

      if (
        querySnapshot.docs.length === 0 ||
        (querySnapshot.doclength > 0 && profile.userName === userName)
      ) {
        setUserNameExist(false);
      } else {
        setUserNameExist(true);
      }
    }
    setCheckPending(false);
  };

  const getHelperText = () => {
    if (!firstClick) {
      return '';
    }
    if (userName.length === 0) {
      return 'User name should not be blank';
    }
    if (userNameExist && !checkPending) {
      return 'user name exist!';
    }
    return '';
  };

  const submit = async () => {
    setPending(true);
    try {
      const profileRef = doc(db, 'profile', user.uid);
      await setDoc(profileRef, { ...profile, userName });
      const garageRef = doc(db, 'garage', user.uid);
      const docSnap = await getDoc(garageRef);

      if (docSnap.exists()) {
        await updateDoc(garageRef, { userName });
      }

      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error(error.message);
    }
    setPending(false);
  };

  const getProfile = async () => {
    setPending(true);
    const docRef = doc(db, 'profile', user.uid);
    const docSnap = await getDoc(docRef);
    setProfile({ userName: '' });
    if (docSnap.exists()) {
      setProfile(docSnap.data());
      if (docSnap.data().userName) {
        setUserName(docSnap.data().userName);
        setLottieName(docSnap.data().userName);
        setUserNameExist(false);
      }
    }
    setPending(false);
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dashboard_account">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!editing && (
        <IconButton
          color="primary"
          id="dashboard_account_editButton"
          onClick={() => {
            setEditing(true);
          }}
        >
          <EditRoundedIcon />
        </IconButton>
      )}
      <div className="dashboard_account_avatar">
        {lottieName && lottieName.length > 0 && !userNameExist ? (
          <img
            src={`https://avatars.dicebear.com/api/adventurer/${lottieName}.svg`}
            alt="user's logo"
          ></img>
        ) : (
          <Lottie animationData={nullAvatar}></Lottie>
        )}
      </div>
      <div className="dashboard_account_textfield">
        <TextField
          fullWidth
          value={userName}
          onChange={changeUseName}
          variant="outlined"
          label="user name"
          onClick={() => {
            if (editing) {
              setFirstClick(true);
            }
          }}
          disabled={!editing}
          helperText={getHelperText()}
          error={firstClick && (userName.length === 0 || userNameExist)}
        ></TextField>
        <div className="dashboard_account_textfield_pending">
          {checkPending && <CircularProgress />}
        </div>
      </div>
      <div className="dashboard_account_button">
        {editing ? (
          <Button
            variant="contained"
            fullWidth
            disabled={
              !userName ||
              userName.length === 0 ||
              userNameExist ||
              pending ||
              checkPending
            }
            onClick={submit}
          >
            submit
          </Button>
        ) : null}
      </div>
    </div>
  );
}
export default Account;
