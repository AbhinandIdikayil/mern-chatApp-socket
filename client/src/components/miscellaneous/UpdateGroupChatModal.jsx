import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { UseChatState } from '../../context/ChatProvider';
import UserBadgeItemn from '../user/UserBadgeItemn';
import { axiosInstance } from '../../services/axios';
import UserListItem from '../user/UserListItem';

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setloading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()


    const { user, selectedChat, setSelectedChat } = UseChatState()
    const { isOpen, onOpen, onClose } = useDisclosure();



    const handleRename = async () => {
        if (!groupChatName) return
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axiosInstance.put('/api/chat/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            setRenameLoading(false)
            console.log(error)
        }
        setGroupChatName('')
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }
        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axiosInstance.get(`/api/user?search=${search}`, config)
            setloading(false)
            setSearchResult(data)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id != user._id && user1._id != user._id) {
            toast({
                title: 'Only admin can add someone',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return
        }
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        try {
            const { data } = await axiosInstance.put(`/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            if (data) {
                user1._id == user._id ? setSelectedChat() : setSelectedChat(data)
                fetchMessages()
                setFetchAgain(!fetchAgain)
                setloading(false)
            }
        } catch (error) {
            console.log(error)
        }

    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find(u => u._id == user1?._id)) {
            toast({
                title: 'User already exist',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only admin can add someone',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return
        }
        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axiosInstance.put(`/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            if (data) {
                setSelectedChat(data);
                setFetchAgain(!fetchAgain)
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={'flex'} justifyContent={'center'}> {selectedChat.chatName} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display={'flex'} flexWrap={'wrap'}>
                            {
                                selectedChat.users.map((user) => (
                                    <UserBadgeItemn key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                                ))
                            }
                        </Box>
                        <FormControl display={'flex'}>
                            <Input placeholder='Chat name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant={'solid'} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>update</Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add user to group'
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                        </FormControl>
                        {
                            loading ? (
                                <Spinner />
                            ) : (
                                searchResult?.map((user) => (
                                    <UserListItem key={user?._id} user={user} handleFunction={() => handleAddUser(user)} />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal