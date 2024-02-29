import { Box, Text, Stack, Center, Divider, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const [user, setUser] = useState({
    NID: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    DATE_OF_BIRTH: "",
    CONTACT_NO: "",
    EMAIL: "",
  });
  useEffect(() => {
  setUser(location.state);
  },[location.state]);

  const formatDate = (dateString:string) => {
    const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const};
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <Center h="100vh">
      <Box w="400px" p={4} boxShadow="lg">
        <Flex justifyContent="center">
          <Text fontSize="2xl" mb={4}>Dashboard</Text>
        </Flex>
        <Stack spacing={1}>
          <Text><strong>NID:</strong> {user.NID}</Text>
          <Divider my={0} borderColor="gray.500" />
          <Text><strong>First Name:</strong> {user.FIRST_NAME}</Text>
          <Divider my={0} borderColor="gray.500" />
          <Text><strong>Last Name:</strong> {user.LAST_NAME}</Text>
          <Divider my={0} borderColor="gray.500" />
          <Text><strong>Date of Birth:</strong> {formatDate(user.DATE_OF_BIRTH)}</Text>
          <Divider my={0} borderColor="gray.500" />
          <Text><strong>Contact No:</strong> {user.CONTACT_NO}</Text>
          <Divider my={0} borderColor="gray.500" />
          <Text><strong>Email:</strong> {user.EMAIL}</Text>
        </Stack>
      </Box>
    </Center>
  );
}

export default Dashboard