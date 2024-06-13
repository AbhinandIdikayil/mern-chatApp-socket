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
import io from 'socket.io-client'
import Lottie, {} from 'react-lottie'
import animationData from '../animation/typing.json'
const defaultOptios = {
    loop:true,
    autoplay:true,
    animationData,
    rendererSettings: {
        preserveAspectRatio:'xMidYMid slice'
    }
}


const ENDPOINT = 'http://localhost:3000';
var SOCKET, SELECTEDCHATCOMPARE;

function SingleChat({ fetchAgain, setFetchAgain }) {

    const [messsages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const { user, selectedChat, setSelectedChat } = UseChatState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchMessages();
        SELECTEDCHATCOMPARE = selectedChat
    }, [selectedChat])

    useEffect(() => {
        SOCKET = io(ENDPOINT);
        SOCKET.emit('setup', user)
        SOCKET.on('connected', () => setSocketConnected(true))
        SOCKET.on('typing', () => setIsTyping(true));
        SOCKET.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        SOCKET.on('message recieved', (newMessageRecieved) => {
            if (!SELECTEDCHATCOMPARE || SELECTEDCHATCOMPARE._id != newMessageRecieved.chat._id) {
                // give notification
            } else {
                setMessages([...messsages, newMessageRecieved])
            }
        })
    })

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
                SOCKET.emit('join chat', selectedChat._id)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function sendMessage(e) {
        SOCKET.emit('stop typing',selectedChat._id)
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

                SOCKET.emit('new message', data);

                setMessages([...messsages, data]);
            } catch (error) {
                console.log(error)
            }
        }
    }

    function typingHandler(e) {
        setNewMessage(e.target.value);
        // typing indicator logic
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            SOCKET.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDifference = timeNow - lastTypingTime;
            if (timeDifference >= timerLength && typing) {
                SOCKET.emit('stop typing', selectedChat._id);
                setTyping(false)
            }
        }, timerLength)
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
                                {
                                    isTyping ? <div>
                                        <Lottie options={defaultOptios} width={70} style={{marginBottom:15,marginLeft:0}} />
                                    </div>: <></>
                                }
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