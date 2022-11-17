import {
  Backdrop,
  CircularProgress,
  Fab,
  Grid,
  Input,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import Lottie from 'lottie-react';
import emptyImage from './../../../images/lotties/2705-image-loading.json';
import PhotoFilter from '@mui/icons-material/PhotoFilter';
import './index.scss';
import { addDoc, collection } from 'firebase/firestore';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';
import { db } from './../../../firebase';
import { toast } from 'react-toastify';
import { useAuthController } from '../../../context';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import Resizer from 'react-image-file-resizer';

function NewItem() {
  const [authController,] = useAuthController();
  const { user } = authController;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: null,
  });

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [firstClicks, setFirstClick] = useState({
    name: false,
    description: false,
  });

  const handleChangeName = (e) => {
    if (e.target.value.length > 20) {
      return;
    }
    setFormData({ ...formData, name: e.target.value });
  };

  const handleChangeDescription = (e) => {
    if (e.target.value.length > 250) {
      return;
    }
    setFormData({ ...formData, description: e.target.value });
  };

  const handleChangeImage = async (e) => {
    try {
      Resizer.imageFileResizer(
        e.target.files[0],
        100,
        100,
        e.target.files[0].type,
        100,
        0,
        (url) => {
          const image = new File([url], e.target.files[0].name);
          setImage(image);
        },
        'file',
        100,
        100
      );
    } catch (err) {
      toast.error('resize image error');
    }
  };

  const handleSubmit = async () => {
    if (
      image === null ||
      formData.name.length === 0 ||
      formData.description.length === 0
    ) {
      return;
    }
    setIsLoading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `/itemImages/${user.uid}/${image.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, 'item'), { ...formData, url, uid: user.uid });

      toast.success('Garge Item has been created successfully!');
      navigate('/dashboard/items');
    } catch (error) {
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <Grid container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <label className="dashboard_newItem_imgInput">
        {image ? (
          <img src={URL.createObjectURL(image)} alt="item"></img>
        ) : (
          <Lottie animationData={emptyImage} />
        )}
        <Input
          inputProps={{ accept: 'image/png, image/jpeg' }}
          id="dashboard_newItem_imgInput_input"
          type="file"
          onChange={handleChangeImage}
        />
        <Fab component="span" id="dashboard_newItem_imgInput_icon">
          <PhotoFilter />
        </Fab>
        <p>image will be resized to be 100 x 100 automatically</p>
      </label>

      <Grid container gap={5} id="dashboard_newItem_textForm">
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            variant="outlined"
            label="name"
            name="name"
            placeholder="at least 1 and at most 20 characters"
            value={formData.name}
            onClick={() => setFirstClick({ ...firstClicks, name: true })}
            error={firstClicks.name && formData.name.length === 0}
            onChange={handleChangeName}
          ></TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            rows={4}
            fullWidth={true}
            value={formData.description}
            label="description"
            id="dashboard_newItem_textForm_textarea"
            placeholder="descrition should be at least 1 and at most 250 characters"
            error={firstClicks.description && formData.description.length === 0}
            onClick={() => setFirstClick({ ...firstClicks, description: true })}
            onChange={handleChangeDescription}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            fullWidth={true}
            disabled={
              image === null ||
              formData.name.length === 0 ||
              formData.description.length === 0
            }
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default NewItem;
