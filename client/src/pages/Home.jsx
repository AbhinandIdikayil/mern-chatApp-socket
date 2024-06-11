import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useNavigate } from 'react-router-dom'


function Home() {

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.stringify(localStorage.getItem('userInfo'));

    if (userInfo) {
      navigate('/chats')
    }

  }, [navigate])

  return (
    <Container maxW='xl' centerContent>
      <Box display='flex' justifyContent='center' p={3} bg={'white'} w='100%' m='40px 0 15px 0' borderRadius='lg' borderWidth='1px'>
        <Text fontSize={'x-large'}>Talk-A-Tive</Text>
      </Box>
      <Box bg-white w='100%' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home