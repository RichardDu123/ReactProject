import { IconButton, Button, Container, Link } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const itemList = (itemList, addItemIntoCanvas) => {
  const items = itemList.map((item, index) => (
    <div key={index} className="dashboard_garage_itemList_items_item">
      <img src={item.url} alt={item.description}></img>
      <IconButton
        onClick={() => {
          addItemIntoCanvas(item);
        }}
        id="dashboard_garage_itemList_item_button"
      >
        <AddCircleIcon />
      </IconButton>
    </div>
  ));
  return items;
};

const DashboardGarageItemList = ({
  items,
  canvasItems,
  itemLimit,
  addItemIntoCanvas,
}) => {
  const navigate = useNavigate();
  return (
      <Container>
        <div className="dashboard_garage_itemList_items">
          <div className="dashboard_garage_itemList_items_item">
            <Button
              fullWidth={true}
              variant="contained"
              onClick={() => {
                navigate('/dashboard/new-item');
              }}
            >
              Create Item
            </Button>
          </div>
          {items && items.length > 0 ? itemList(items, addItemIntoCanvas) : null}
        </div>
        <Link
          href="#"
          onClick={() => {
            navigate('/dashboard/upgrade');
          }}
        >
          {itemLimit - canvasItems.length}/ {itemLimit} items left, need to upgrade?
        </Link>
      </Container>
  );
};

export default DashboardGarageItemList;
