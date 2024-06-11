import React, { useState } from 'react'
import {
  Avatar, Box, Button,
  Drawer, DrawerBody, DrawerCloseButton, DrawerContent,
  DrawerFooter,
  DrawerHeader, DrawerOverlay, Input, Menu,
  MenuButton, MenuDivider, MenuItem,
  MenuList, Text, Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { UseChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../services/axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../user/UserListItem'

function SideDrawer() {

  const toast = useToast()  // for toasting


  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user } = UseChatState();


  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const navigate = useNavigate()
  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }


  async function handleSearch() {
    if (!search) {
      toast({
        title: 'Pleae enter something in the field',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
      return
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axiosInstance.get(`/api/user?search=${search}`, config)
      if (data) {
        console.log(data)
        setLoading(false)
        setSearchResult(data)
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error occured',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  function accessChat(userId) {

  }

  return (
    <>
      <Box display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: 'flex' }} px='4'>
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize='2xl'>
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user?.name} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                {/* <MenuItem> My profile</MenuItem> */}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>

      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent p={1}>
          <DrawerCloseButton />
          <DrawerHeader>Search for users</DrawerHeader>

          <DrawerBody>
            <Box display={'flex'} alignItems={'center'} pb={2}>
              <Input placeholder='Type here...' value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem key={user._id} user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                )
              })
            )}
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
