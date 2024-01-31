// RegistrationForm.js
import { useState } from "react";
import { Button, Flex, Input, VStack, useToast } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import axios from "axios";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    nid: "",
    username: "",
    email: "",
    password: "",
  });
  const toast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/v1/register", formData)
      .then((response) => {
        // Handle success
        console.log("Response:", response.data);
        toast({
          title: "Account created successfully",
          status: "success",
          duration: 3000, // Optional duration for the toast
          isClosable: true,
        });
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
        toast({
          title: "Error creating account",
          description: error.response.data.message || "An error occurred",
          status: "error",
          duration: 3000, // Optional duration for the toast
          isClosable: true,
        });
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <VStack spacing={4} width="300px">
        <Input
          type="text"
          name="nid"
          placeholder="NID"
          value={formData.nid}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit} colorScheme="teal">Sign Up</Button>
      </VStack>
    </div>
  );
};

export default RegistrationForm;
