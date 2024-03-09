import { Box, Button,Flex,Heading,Spacer,Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

type Reservation = {
  PNR: string,
    FROM_STATION: string,
    TO_STATION: string,
    ISSUE_DATE: string,
    DATE_OF_JOURNEY: string,
    TOTAL_FARE: number,
}

const CancelReservation = () => {
  const toast = useToast();
  const location=useLocation();
  const [user, setUser] = useState({
    NID: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    DATE_OF_BIRTH: "",
    CONTACT_NO: "",
    EMAIL: "",
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const getReservationInfo = () => {
    try {
      axios.get(`http://localhost:5000/api/v1/reservation/${user.NID}`)
      .then((response) => {
        console.log(response.data);
        setReservations(response.data);
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleCancelClick=(pnr:string)=>{
    console.log("Cancel Reservation");
    try {
      axios.delete(`http://localhost:5000/api/v1/reservation/${pnr}`)
      .then((response) => {
        console.log(response);
        getReservationInfo();
        toast({
          title: "Reservation Cancelled",
          description: "Reservation has been cancelled successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      
    }
  }

  useEffect(() => {
  setUser(location.state);
  },[location.state]);

  useEffect(() => {
    getReservationInfo();
  },[user]);
  return (
    <Box>
      <Heading size="lg" textAlign="center" my={4}>Cancel Reservation</Heading>
      {reservations.map((reservation) => {
        const issueDate = new Date(reservation.ISSUE_DATE).toLocaleDateString();
        const journeyDate = new Date(reservation.DATE_OF_JOURNEY).toLocaleDateString();

        return (
          <Box key={reservation.PNR} display="flex" flexDirection="column" justifyContent="space-between" alignItems="start" mx={2} mb="4" p="5" border="2px" borderRadius="md" borderColor="blue.400" bgColor="gray.100">
            <Heading size="md">{reservation.FROM_STATION} - {reservation.TO_STATION}</Heading>
            <Spacer />
            <Heading size="sm">Issue Date: {issueDate}</Heading>
            <Spacer />
            <Heading size="sm">Date of Journey: {journeyDate}</Heading>
            <Spacer />
            <Heading size="sm">Total Fare: {reservation.TOTAL_FARE}</Heading>
            <Button alignSelf="flex-end" colorScheme="red" onClick={() => handleCancelClick(reservation.PNR)}>Cancel</Button>
          </Box>
        );
      })}
    </Box>
  );
}

export default CancelReservation