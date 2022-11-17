// React
import {forwardRef, useMemo, Fragment} from 'react';

// MUI Components
import Link from '@mui/material/Link';

// React Router
import { Link as RouterLink } from 'react-router-dom';

function ListItemLink(props) {
  const { primary, to } = props;

  const renderLink = useMemo(
    () =>
      forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  return (
    <Link
      variant="button"
      color="text.primary"
      component={renderLink}
      sx={{ my: 1, mx: 1.5 }}
      underline="none"
    >
      {primary}
    </Link>
  );
}


export const mainListItems = (
  <Fragment>
    <ListItemLink to="/home" primary="Home" />
    <ListItemLink to="/garages" primary="Garages"/>
  </Fragment>
);