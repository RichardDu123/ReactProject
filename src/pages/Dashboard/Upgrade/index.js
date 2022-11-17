// React
import { useEffect, useState } from 'react';

// MUI
import {
  Backdrop,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Assets
import Lottie from 'lottie-react';
import upgradeImage from './../../../images/lotties/upgrade.json';

// Firebase
import {
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';

// Context
import { useAuthController, useAppController } from '../../../context';

// Toast
import { toast } from 'react-toastify';

// CSS
import './index.scss';

function Upgrade() {
  const [authController, ] = useAuthController();
  const { user } = authController;
  const [appController, ] = useAppController();
  const { darkMode } = appController;
  const [amount, setAmount] = useState(0);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleIncrement = () => {
    if (amount + 1 <= credits) {
      setAmount(amount + 1);
    }
  };

  const handleDecrement = () => {
    setAmount(amount + -1);
  };

  async function deposit() {
    const depositAmount = parseInt(topUpAmount);
    if (depositAmount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    setLoading(true);
    const walletRef = doc(db, 'wallet', user.uid);
    try {
      await setDoc(walletRef, { credits: increment(depositAmount) });
      setCredits(depositAmount);
      setAmount(0);
      toast.success('Credits updated');
    } catch (error) {
      toast.error('Failed to update credits');
    } finally {
      setLoading(false);
      setTopUpAmount(0);
      handleClose();
    }
  }

  const handleConfirm = async () => {
    //call service
    setIsLoading(true);
    const docRef = doc(db, 'wallet', user.uid);
    const docSnap = await getDoc(docRef);
    var gap = 0;

    if (docSnap.exists()) {
      const walletCredits = docSnap.data().credits;
      gap = walletCredits - amount;
    } else {
      gap = 0 - amount;
    }
    if (gap >= 0 && amount > 0) {
      const walletRef = doc(db, 'wallet', user.uid);
      const garageRef = doc(db, 'garage', user.uid);

      try {
        await setDoc(walletRef, { credits: gap });
        await updateDoc(garageRef, { itemLimit: increment(amount) });
        setCredits(gap);
        setAmount(0);
        toast.success('Garage expanded');
      } catch (error) {
        toast.error('Failed to expand garage');
      }
    } else {
      toast.error('Insufficent balance');
    }
    setIsLoading(false);
  };
  const getCreadits = async () => {
    const docRef = doc(db, 'wallet', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCredits(docSnap.data().credits);
    } else {
      const walletRef = doc(db, 'wallet', user.uid);
      await setDoc(walletRef, { credits: 0 }).catch(() => {
        toast.error('create wallet failed');
      });
    }
  };
  useEffect(() => {
    getCreadits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="dashboard_upgrade">
      <Dialog open={open} onClose={handleClose} sx={{}}>
        <DialogTitle>Purchase Credits</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter amount to purchase
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Credits"
            type="text"
            fullWidth
            variant="standard"
            value={topUpAmount}
            disabled={loading}
            onChange={(e) => {
              let input = e.target.value ;
              if(!input || (input[input.length-1].match('[0-9]') && input[0].match('[1-9]'))) setTopUpAmount(e.target.value)
            }}
            InputProps={{
              inputMode: 'numeric',
              pattern: "[0-9]*",
              inputProps: { min: 0 }
            }}
          />
        </DialogContent>
        <DialogActions>
          {!loading && <Button onClick={handleClose}>Cancel</Button>}
          <LoadingButton onClick={deposit} loading={loading}>Confirm</LoadingButton>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="dashboard_upgrade_header">
        <Lottie animationData={upgradeImage}></Lottie>
      </div>
      <div className={darkMode ? "dashboard_upgrade_middle-dark" : "dashboard_upgrade_middle"}>
        <p>Balance : {credits} &#9733;</p>
      </div>
      <Grid container spacing={3} id="dashboard_upgrade_form">
        <Grid item xs={12}>
          <Button variant="contained" sx={{marginTop: 2}} disabled={loading} onClick={handleClickOpen} fullWidth>Deposit</Button>  
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup size="small" fullWidth>
            <Button disabled={amount <= 0} onClick={handleDecrement}>
              -
            </Button>
            <Button disabled>{amount}</Button>
            <Button disabled={amount >= credits} onClick={handleIncrement}>
              +
            </Button>
          </ButtonGroup>
          <p className="dashboard_upgrade_comment">
            (one &#9733; worth one item space in garage &#128525; )
          </p>
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={amount <= 0}
            fullWidth
            variant="contained"
            onClick={handleConfirm}
          >
            CHECK OUT
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
export default Upgrade;
