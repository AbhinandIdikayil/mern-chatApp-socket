import React, { useEffect, useState } from 'react'
import {UseChatState} from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer'
import ChatBox from '../components/ChatBox';


function Chats() { 

  const { user } = UseChatState();

  return (
    <div style={{width: '100%'}}>
          {user && <SideDrawer /> }
          <Box display='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
          {user && <ChatBox />}
          </Box>
    </div>
  )
}

export default Chats