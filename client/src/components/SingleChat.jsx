import React, { useEffect, useState } from 'react'
import { UseChatState } from '../context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { axiosInstance } from '../services/axios'
import './styles.css'
import ScrollableChat from './ScrollableChat'

function SingleChat({ fetchAgain, setFetchAgain }) {

    const [messsages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const { user, selectedChat, setSelectedChat } = UseChatState()

    const toast = useToast();

    useEffect(() => {
        fetchMessages();
    }, [selectedChat])

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axiosInstance.get(`/api/message/${selectedChat._id}`, config)
            if (data) {
                setMessages(data)
                setLoading(false);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function sendMessage(e) {
        if (e.key == 'Enter' && newMessage) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage(' ');
                const { data } = await axiosInstance.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                console.log(data)
                setMessages([...messsages, data]);
            } catch (error) {
                console.log(error)
            }
        }
    }

    function typingHandler(e) {
        setNewMessage(e.target.value);
        // typing indicator logic

    }


    return (
        <>
            {
                selectedChat ? (
                    <>

                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb={3}
                            px={2}
                            w='100%'
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat('')}
                            />
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {

                                        selectedChat.chatName.toUpperCase()

                                    }
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                </>
                            )}

                        </Text>
                        <Box
                            display={'flex'}
                            flexDir={'column'}
                            justifyContent={'flex-end'}
                            p={3}
                            bg='#E8E8E8'
                            w='100%'
                            h={'100%'}
                            borderRadius='lg'
                            overflowY={'hidden'}
                        >
                            {
                                loading ? (
                                    <Spinner size={'xl'} w={20} h={20} alignSelf={'center'} />
                                ) : (
                                    <div className='messages'>
                                        <ScrollableChat messages={messsages} />
                                    </div>
                                )
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input border='1px' value={newMessage} placeholder='Enter a message..' onChange={typingHandler} variant={'filled'} bg={'#E8E8E8'} />
                            </FormControl>
                        </Box>
                    </>

                ) : (
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} h='100%'>
                        <Text fontSize={'3xl'} pb={3}>
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat