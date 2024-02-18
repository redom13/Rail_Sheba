import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Input, Text, VStack, Flex, Link, Center, FormControl, FormLabel,useToast } from '@chakra-ui/react';
import { Link as RouterLink,useLocation,useNavigate } from 'react-router-dom';
import axios, { formToJSON } from 'axios';
import backgroundImage from '../train.jpg';

interface Props {
    setAuth: (auth: boolean) => void;
    setLogin: (auth: boolean) => void;
    setLogged: (auth: boolean) => void;
  }

const Login = ({setAuth,setLogin,setLogged}:Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({ username: '', password: '' });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    useEffect(() => {
        setLogin(true);
    }, []);

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
            axios 
            .post("http://localhost:5000/api/v1/auth/login", formData)
            .then((response) => {
                console.log("Response:", response.data);
                if (response.data.jwtToken) {
                    localStorage.setItem("jwtToken", response.data.jwtToken);
                    setAuth(true);
                    setLogged(true);
                    setLogin(false);
                    if (location.pathname === "/login") navigate("/");
                    else navigate(location.pathname);
                    toast({
                        title: "Login successful",
                        status: "success",
                        duration: 3000, // Optional duration for the toast
                        isClosable: true,
                    });
                }
                else {
                    setAuth(false);
                    toast({
                        title: "Error logging in",
                        description: response.data.message || "An error occurred",
                        status: "error",
                        duration: 3000, // Optional duration for the toast
                        isClosable: true,
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                toast({
                    title: "Error logging in",
                    description: error.response.data.message || "An error occurred",
                    status: "error",
                    duration: 3000, // Optional duration for the toast
                    isClosable: true,
                });
            });
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
                        <Text fontSize="2xl" color="black" fontWeight="bold" mb={4}>
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
                        <Link as={RouterLink} to="/register" mx={2} color="orange" onClick={()=>{
                            setLogin(false);
                        }}>
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