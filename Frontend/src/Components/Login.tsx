import React, { ChangeEvent, useState } from 'react';
import { Box, Button, Input, Text, VStack, Flex, Link, Center, FormControl, FormLabel } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { formToJSON } from 'axios';
import backgroundImage from 'D:/L2T1/Rail_Sheba/Frontend/public/train.jpg';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({ username: '', password: '' });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = { username: '', password: '' };

        if (!formData.username) newErrors.username = 'Username is required.';
        if (!formData.password) newErrors.password = 'Password is required.';

        if (newErrors.username || newErrors.password) {
            setErrors(newErrors);
        } else {
            // Submit form
            console.log(formData);

        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
            }}
        >
            <form onSubmit={handleSubmit}>
            <VStack bg="rgba(255, 255, 255, 0.45)" boxShadow="lg" width="300px" p={2} borderRadius="10px" borderWidth="1px">
                <Box>
                    <Center>
                        <Text fontSize="2xl" color="white" fontWeight="bold" mb={4}>
                            Login
                        </Text>
                    </Center>
                    <FormControl fontWeight="bold">
                        <FormLabel color="black">Username</FormLabel>
                    <Input type='text' name='username' placeholder="Username" size="md" mb={4} value={formData.username} onChange={handleChange} />
                    {errors.username && <Text color="red.500">{errors.username}</Text>}
                    <FormLabel color="black">Password</FormLabel>
                    <Input type="password" name='password' placeholder="Password" size="md" mb={4} value={formData.password} onChange={handleChange} />
                    {errors.password && <Text color="red.500">{errors.password}</Text>}
                    </FormControl>
                    <Button colorScheme="teal" size="md" width="100%" mb={4} type="submit">
                        Login
                    </Button>
                    <Flex>
                        <Text fontSize="md" fontWeight="bold">Don't have an account?</Text>
                        <Link as={RouterLink} to="/register" mx={2} color="orange">
                            Sign Up
                        </Link>
                    </Flex>
                </Box>
            </VStack>
            </form>
        </div>
    );
};

export default Login;