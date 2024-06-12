import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { UseChatState } from '../../context/ChatProvider';
import { axiosInstance } from '../../services/axios';
import UserListItem from '../user/UserListItem'
import UserBadgeItemn from '../user/UserBadgeItemn';


function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChat, setGroupChat] = useState();
    const [selectedUsers, setSelectedUseres] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const { chats, setChats, user } = UseChatState()

    async function handleSearch(query) {
        setSearch(query);
        if (!query) {
            return
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            }

            const { data } = await axiosInstance.get(`/api/user?search=${search}`, config);
            if (data) {
                setLoading(false);
                setSearchResult(data)
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

    async function handleSubmit() {
        if (!groupChat || !selectedUsers) {
            toast({
                title: 'Pleae fill all the form',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            }
            const { data } = await axiosInstance.post(`/api/chat/group`, {
                name: groupChat,
                users: JSON.stringify(selectedUsers.map(user => user?._id))
            }, config)
            setChats([data, ...chats]);
            onClose()
            toast({
                title: 'New group chat created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return
        } catch (error) {
            console.log(error)
        }
    }


    function handleDelete(user) {
        setSelectedUseres(
            selectedUsers.filter((sel) => sel._id != user._id)
        )
    }

    function handleGroup(userToAdd) {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return
        }
        setSelectedUseres([...selectedUsers, userToAdd])
    }

    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={'flex'} justifyContent={'center'}>Create groupchat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
                        <FormControl>
                            <Input mb={3}
                                placeholder='group name'
                                value={groupChat}
                                onChange={(e) => setGroupChat(e.target.value)}
                            />
                            <Input
                                placeholder='Add users eg: john,piyush'
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                mb={2}
                            />
                        </FormControl>
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>

                            {selectedUsers?.map((user) => {
                                return (
                                    <UserBadgeItemn key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                                )
                            })}
                        </Box>

                        {
                            loading ? <Spinner mt={4} /> : (
                                searchResult?.slice(0, 4).map(user => {
                                    return (
                                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                    )
                                })
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal