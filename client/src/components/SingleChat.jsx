import React from 'react'
import { UseChatState } from '../context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'


function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat } = UseChatState()
    return (
        <>
            {
                selectedChat ? (
                    
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb={3}
                            px={2}
                            w='100%'
                            display={'flex'}
                            justifyContent={ 'space-between' }
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
                                    <ProfileModal user={getSenderFull(user , selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {
                                        selectedChat.chatName.toUpperCase()
                                    }
                                </>
                            )}

                        </Text>
                    
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