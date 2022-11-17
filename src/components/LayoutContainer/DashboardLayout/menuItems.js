// React
import {forwardRef, useMemo, Fragment} from 'react';

// MUI Components
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';

// React Router
import { Link as RouterLink } from 'react-router-dom';
import {useAuthController} from "../../../context";

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = useMemo(
    () =>
      forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default function MainListItems() {

  const [authController,] = useAuthController();
  const { admin } = authController;

  return (
    <Fragment>
      <ListItemLink to="/home" primary="Home" icon={<HomeIcon />} />
      <ListItemLink to="/dashboard/home" primary="Dashboard" icon={<DashboardIcon />} />
      <ListItemLink to="/dashboard/account" primary="Account" icon={<AccountBoxIcon />} />
      { admin ?
        <ListItemLink to="/admin" primary="Admin" icon={<AdminPanelSettingsIcon />} />
        :
        null
      }
      <Divider sx={{ my: 1 }} />
      <ListItemLink to="/dashboard/garage" primary="Garage" icon={<WarehouseIcon />} />
      <ListItemLink to="/dashboard/items" primary="Items" icon={<InventoryIcon />} />
      <ListItemLink to="/dashboard/favorites" primary="Favorites" icon={<FavoriteIcon />} />
    </Fragment>
  )
}