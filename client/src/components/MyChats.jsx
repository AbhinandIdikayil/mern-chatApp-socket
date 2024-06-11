import React, { useEffect, useState } from 'react'
import { UseChatState } from '../context/ChatProvider'
import { useToast } from '@chakra-ui/react'
import { axiosInstance } from '../services/axios'


function MyChats() {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = UseChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axiosInstance.get('/api/chat', config);
      console.log(data,'ji')
      if (data) {
        setChats(data)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error occured',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }


  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [])

  return (
    <div>MyChats</div>
  )
}

export default MyChats