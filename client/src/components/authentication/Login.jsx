import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { axiosInstance } from '../../services/axios'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function Login() {

    const toast = useToast()  // for toasting

    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleClick = () => setShow(!show)

    async function submitHandler() {
        if (!password || !email) {
            toast({
                title: 'Please Fil all the form',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            return
        }
        const { data } = await axiosInstance.post('/api/user/login',{email,password});
        if (data) {
            toast({
                title: 'Logined sucessfully.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            localStorage.setItem('userInfo',JSON.stringify(data));
      navigate('/chats')
        };
    }
    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>email</FormLabel>
                <Input type={'email'} value={email} placeholder='Enter your name' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        value={password}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >
                login
            </Button>
            <Button
                variant='solid'
                colorScheme="red"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={() => {
                    setEmail('guest@example.com')
                    setPassword('123456')
                }}
            >
                Get user credentials
            </Button>
        </VStack>
    )
}

export default Login