import { useNavigate } from 'react-router-dom'
import './index.scss'

const itemList = (itemList, navigate) => {
  const handleImgClick = (id) => {
    navigate(`/item?id=${id}`)
  }
  const items = itemList.map((item, index) => (
    <div key={index} className="dashboard_garage_itemList_item" onClick={() => handleImgClick(item.id)}>
      <img src={item.url} alt={item.description}></img>
    </div>
  ))
  return items
}

const HomePageGarageItemList = ({
  items,
  canvasItems,
  itemLimit,
  addItemIntoCanvas,
}) => {
  const navigate = useNavigate()
  return (
    <div className="dashboard_garage_itemList">
      {items && items.length > 0 ? itemList(items, navigate) : null}
    </div>
  )
}

export default HomePageGarageItemList
