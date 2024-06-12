import { Box, CloseButton } from '@chakra-ui/react'
import React from 'react'

function UserBadgeItemn({ user, handleFunction }) {
    return (
        <Box display={'flex'} alignItems={'center'}
            px={2}
            py={1}
            borderRadius='lg'
            m={1}
            mb={2}
            variant='solid'
            fontSize={12}
            backgroundColor="purple"
            color={'white'}
            cursor={'pointer'}
            onClick={handleFunction}
        >
            {user?.name}
            <CloseButton pl={1} />
        </Box>
    )
}

export default UserBadgeItemn