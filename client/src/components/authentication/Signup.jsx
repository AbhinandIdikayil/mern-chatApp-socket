import React, { useState } from 'react'
import { Stack, HStack, VStack, FormControl, FormLabel, Input, InputRightElement, InputGroup, Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { axiosInstance } from '../../services/axios'
import {useNavigate} from 'react-router-dom'

function Signup() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const toast = useToast()

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show);

  async function submitHandler() {
    if (!name || !email || !password) {
      toast({
        title: 'Please Fil all the form',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }
    const { data } = await axiosInstance.post('/api/user', { name, email, password });
    if (data) {
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      localStorage.setItem('userInfo',JSON.stringify(data));
      navigate('/chats')
    }
  }


  return (
    <VStack spacing='5px'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input value={name} placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>email</FormLabel>
        <Input type={'email'} value={email} placeholder='Enter your name' onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
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
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup