import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Text,
  Flex,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input,
} from "@chakra-ui/react";
import bkashImage from "../BKASH.png"; // Import your bkash image here
import nagadImage from "../NAGAD.png"; // Import your nagad image here
import rocketImage from "../ROCKET.png"; // Import your rocket image here
import ddblImage from "../DBBL.jpg"; // Import your ddbl image here
import { set } from "lodash";
import axios from "axios";
import { useLocation } from "react-router-dom";

type seat = {
  compId: Number;
  no: Number;
};

const Payment = () => {
  const location = useLocation();
  const [payableAmount, setPayableAmount] = useState(100); // Set default payable amount
  const [accNo, setAccNo] = useState("");
  const [method, setMethod] = useState("Mobile Pay");
  const [mobilePayMethod, setMobilePayMethod] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    NID: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    DATE_OF_BIRTH: "",
    CONTACT_NO: "",
    EMAIL: "",
  });
  const {
    pnr,
    fromStation,
    toStation,
    TRAIN_ID,
    trainName,
    selectedDate,
    className,
    SEATS,
    TOTAL_FARE,
    issueDate,
  } = location.state;
  console.log("Payment page:",pnr, fromStation, toStation, TRAIN_ID, trainName, selectedDate, className, SEATS, TOTAL_FARE, issueDate);
  const cancelRef = React.useRef(null);
  const handleMobileClick = (method: string) => {
    setMobilePayMethod(method);
    setIsOpen(true);
  };
  const onMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccNo(e.target.value);
  };
  useEffect(() => {
    setPayableAmount(TOTAL_FARE);
  }, [TOTAL_FARE]);
  
  const getUser = async () => {
    try {
      console.log("jwtToken:", localStorage.jwtToken);
      const response = await fetch("http://localhost:5000/api/v1/dashboard", {
        method: "GET",
        headers: { jwtToken: localStorage.jwtToken },
      });

      const parseRes = await response.json();
      setUser(parseRes);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const handleMobileConfirmClick = () => {
    console.log(accNo);
    console.log(method);
    try {
      axios
        .post("http://localhost:5000/api/v1/payment", {
          method: method,
          amount: payableAmount,
          accNo: accNo,
        })
        .then((response) => {
          console.log(response);
        });
    } catch (err) {
      console.log(err);
      console.log("Payment failed");
    }
    try{
      axios
      .post("http://localhost:5000/api/v1/reservation", {
      PNR: pnr,  
      NID: user.NID,
      SEATS: SEATS,
      FROM_ST: fromStation,
      TO_ST: toStation,
      ISSUE_DATE: issueDate,
      DATE_OF_JOURNEY: selectedDate,
      TOTAL_FARE: TOTAL_FARE,
    })
    .then((response) => {
      console.log(response);
    });
    }
    catch(err){
      console.log(err);
      console.log("Reservation failed");
    }
    // try {
    //   SEATS.forEach(async (seat:seat) => {
    //     await axios.post("http://localhost:5000/api/v1/reservation", {
    //       PNR: pnr,
    //       NID: user.NID,
    //       COMPARTMENT_ID: seat.compId,
    //       SEAT_NO: seat.no,
    //       FROM_ST: fromStation,
    //       TO_ST: toStation,
    //       ISSUE_DATE: issueDate,
    //       DATE_OF_JOURNEY: selectedDate,
    //     })
    //     .then((response) => {
    //       console.log(response);
    //     });
    //   });
    // } catch(err) {
    //   console.log(err);
    //   console.log("Reservation failed");
    // }
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Payable Amount: ${payableAmount}
      </Text>

      <Tabs
        variant="soft-rounded"
        colorScheme="teal"
        onChange={(index) => setMethod(index === 0 ? "Mobile Pay" : "Bank Pay")}
      >
        <TabList>
          <Tab>Mobile Pay</Tab>
          <Tab>Bank Pay</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Mobile Pay Content */}
            <Box p={4}>
              {/* Add your mobile payment form or component here */}
              <Text>Mobile payment options will be displayed here.</Text>
              <Flex>
                <img
                  style={{
                    width: "332px",
                    height: "194px",
                    objectFit: "cover",
                    //border: "1px solid black",
                    marginRight: "10px",
                    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  src={bkashImage}
                  alt="bkash"
                  onClick={() => handleMobileClick("Bkash")}
                />
                <img
                  style={{
                    width: "332px",
                    height: "194px",
                    objectFit: "cover",
                    //border: "1px solid black",
                    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  src={nagadImage}
                  alt="nagad"
                  onClick={() => handleMobileClick("Nagad")}
                />
              </Flex>
              <Flex pt={5}>
                <img
                  style={{
                    width: "332px",
                    height: "194px",
                    objectFit: "cover",
                    //border: "1px solid black",
                    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
                  }}
                  src={rocketImage}
                  alt="rocket"
                  onClick={() => handleMobileClick("Rocket")}
                />
              </Flex>
            </Box>
          </TabPanel>
          <TabPanel>
            {/* Bank Pay Content */}
            <Box p={4}>
              {/* Add your bank payment form or component here */}
              <Text>Bank payment options will be displayed here.</Text>
              <img
                style={{
                  width: "300px",
                  height: "150px",
                  objectFit: "cover",
                  //border: "1px solid black",
                  boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
                }}
                src={ddblImage}
                alt="ddbl"
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Payment Information
            </AlertDialogHeader>

            <AlertDialogBody>
              <FormControl id="accountNumber" mb={3}>
                <FormLabel>{mobilePayMethod} Number</FormLabel>
                <Input
                  placeholder={`Enter ${mobilePayMethod} number`}
                  onChange={onMobileChange}
                />
              </FormControl>
              <FormControl id="pinNumber">
                <FormLabel>PIN</FormLabel>
                <Input placeholder="Enter PIN number" type="password" />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                ml={3}
                onClick={handleMobileConfirmClick}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Payment;
