import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { UseChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

function ScrollableChat({ messages }) {
  const { user } = UseChatState()
  console.log(messages)
  return (
    <ScrollableFeed>
      {messages?.map((msg, i) => {
        console.log(msg?.user)
        return (
          <div style={{ display: 'flex', }} key={msg._id}>
            {console.log(isSameSender(messages, msg, i, user._id) || isLastMessage(messages, i, user._id))}
            {(isSameSender(messages, msg, i, user._id) || isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={msg.sender?.name}
                placement='bottom-start'
                hasArrow
              >
                <Avatar mt={'7px'} mr={1} size='sm' cursor={'pointer'} name={msg.sender.name} src={msg.sender.pic} />
              </Tooltip>
            )}
            <span style={{
              backgroundColor:msg?.sender?.id === user?._id ? '#BEE3F8' : '#B9F5D0',
              borderRadius:'20px',
              padding: '5px 15px',
              maxWidth:'75%',
              marginLeft: isSameSenderMargin(messages , msg , i, user?._id) , 
              marginTop: isSameUser(messages , msg , i ) ? 3 : 10,
            }} >
              {msg?.content}
            </span>
          </div>
        )
      }
      )}
    </ScrollableFeed>

  )
}

export default ScrollableChat