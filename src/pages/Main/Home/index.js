import * as React from 'react'
import { useEffect, useState } from 'react'
//mui
import GarageList from './garageList'
import {
  Backdrop,
  CircularProgress,
} from '@mui/material'
//database
import { db } from './../../../firebase'
import {
  collection,
  query,
  getDocs,
  orderBy, limit
} from 'firebase/firestore'
import './index.scss'

function Home () {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getGarages = async () => {
    setIsLoading(true)
    const q = await query(
      collection(db, 'garage'),
      orderBy("favouritesNum", 'desc'),
      limit(8)
    )
    const querySnapshot = await getDocs(q)
    const items = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      items.push({
        ...data,
        id: doc.id,
      })
    })
    setItems(items)
    setIsLoading(false)
  }
  useEffect(() => {
    // call service to get garages
    getGarages()
  }, [])
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Welcome!</h1>
      <h2>Garages For You:</h2>
      <div className='feturedGarage'>
        <GarageList
          items={items}
        ></GarageList>
      </div>

    </>
  )
}
export default Home