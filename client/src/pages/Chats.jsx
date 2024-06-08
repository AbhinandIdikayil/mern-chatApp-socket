import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {axiosInstance} from '../services/axios' 



function Chats() {

  const [chats,setChats] = useState([]);

  const fetchChats = async () => {
    const {data} = await axiosInstance.get('/api/chat')
    setChats(data)
  }

  useEffect(() => {
    fetchChats()
  },[])


  return (
    <div>Chats</div>
  )
}

export default Chats