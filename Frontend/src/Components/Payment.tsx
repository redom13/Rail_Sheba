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
  useToast,
  Center,
  VStack,
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
import { taka } from "../Constants";

type seat = {
  compId: Number;
  no: Number;
};

const Payment = () => {
  const location = useLocation();
  const toast = useToast();
  const [payableAmount, setPayableAmount] = useState(100); // Set default payable amount
  const [accNo, setAccNo] = useState("");
  const [method, setMethod] = useState("Mobile Pay");
  const [mobilePayMethod, setMobilePayMethod] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pin, setPin] = useState("");
  const [bankPayMethod, setBankPayMethod] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");
  const [holderName, setHolderName] = useState("");
  const [bankPin, setBankPin] = useState("");
  const [paymentID, setPaymentID] = useState("");
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
  console.log(
    "Payment page:",
    pnr,
    fromStation,
    toStation,
    TRAIN_ID,
    trainName,
    selectedDate,
    className,
    SEATS,
    TOTAL_FARE,
    issueDate
  );
  const cancelRef = React.useRef(null);
  const handleMobileClick = (method: string) => {
    setMobilePayMethod(method);
    setIsOpen(true);
  };
  const onMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccNo(e.target.value);
  };
  const onPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  const handleBankClick = (method: string) => {
    setBankPayMethod(method);
    setIsOpen(true);
  };

  const onBankAccChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccNo(e.target.value);
  };

  const onHolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHolderName(e.target.value);
  };

  const onBankPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankPin(e.target.value);
  };

  useEffect(() => {
    setPayableAmount(TOTAL_FARE);
  }, [TOTAL_FARE]);

  function generateTransactionId(): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    for (let i = 0; i < 5; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return result
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  useEffect(() => {
    setPaymentID(generateTransactionId());
  }, []);

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

  const handleConfirmClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Confirm clicked");
    console.log("Method:", method);
    if (method === "Mobile Pay" && (accNo === "" || pin === "")) {
      console.log("Returning from mobile pay");
      setIsError(true);
      return;
    } else if (
      method === "Bank Pay" &&
      (bankAccNo === "" || holderName === "")
    ) {
      setIsError(true);
      return;
    }

    interface PaymentData {
      pnr: string;
      method: string;
      amount: number;
      accNo: string;
      holderName?: string;
    }

    const paymentData: PaymentData =
      method === "Mobile Pay"
        ? { pnr, method, amount: payableAmount, accNo }
        : {
            pnr,
            method,
            amount: payableAmount,
            accNo: bankAccNo,
            holderName,
          };

    try {
      axios
        .post("http://localhost:5000/api/v1/reservation", {
          PNR: pnr,
          NID: user.NID,
          SEATS,
          FROM_ST: fromStation,
          TO_ST: toStation,
          ISSUE_DATE: issueDate,
          DATE_OF_JOURNEY: selectedDate,
          TOTAL_FARE,
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            toast({
              title: "Payment successful.Seats reserved successfully!",
              status: "success",
              duration: 3000, // Optional duration for the toast
              isClosable: true,
            });

            try {
              axios
                .post("http://localhost:5000/api/v1/payment", paymentData)
                .then((response) => {
                  console.log(response);
                });
            } catch (err) {
              console.log(err);
              console.log("Payment failed");
            }
          }
        });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        console.log("Reservation failed");
        toast({
          title: "Error reserving seats",
          description: err.message || "An error occurred",
          status: "error",
          duration: 3000, // Optional duration for the toast
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={4}>
      <Center>
        <VStack spacing={4} width="70%">
          <Box border="solid" borderColor="blue.500" w="800px">
            <Center>
              <Text fontSize="xl" m={4} color="green">
                <strong>
                  Total Payable Amount: {taka}
                  {payableAmount}
                </strong>
              </Text>
            </Center>
          </Box>
          <Tabs
            border="solid"
            borderColor="blue.500"
            p={4}
            w="800px"
            h="600px"
            variant="soft-rounded"
            colorScheme="teal"
            onChange={(index) =>
              setMethod(index === 0 ? "Mobile Pay" : "Bank Pay")
            }
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
                  {/* <Text>Bank payment options will be displayed here.</Text> */}
                  <img
                    style={{
                      width: "300px",
                      height: "150px",
                      objectFit: "cover",
                      //border: "1px solid black",
                      boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.2)",
                    }}
                    src={ddblImage}
                    onClick={() => handleBankClick("DBBL")}
                    alt="ddbl"
                  />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Center>
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
              {method === "Mobile Pay" && (
                <>
                  <FormControl id="accountNumber" mb={3}>
                    <FormLabel>Account Number</FormLabel>
                    <Input
                      placeholder={`Enter ${mobilePayMethod} account number`}
                      onChange={onMobileChange}
                    />
                  </FormControl>
                  <FormControl id="pinNumber">
                    <FormLabel>PIN</FormLabel>
                    <Input
                      placeholder="Enter PIN number"
                      type="password"
                      onChange={onPinChange}
                    />
                  </FormControl>
                </>
              )}
              {method === "Bank Pay" && (
                <>
                  <FormControl id="bankAccountNumber" mb={3}>
                    <FormLabel>Bank Account Number</FormLabel>
                    <Input
                      placeholder={`Enter ${bankPayMethod} account number`}
                      onChange={onBankAccChange}
                    />
                  </FormControl>
                  <FormControl id="holderName" mb={3}>
                    <FormLabel>Holder's Name</FormLabel>
                    <Input
                      placeholder="Enter holder's name"
                      onChange={onHolderNameChange}
                    />
                  </FormControl>
                  <FormControl id="bankPinNumber">
                    <FormLabel>PIN</FormLabel>
                    <Input
                      placeholder="Enter PIN number"
                      type="password"
                      onChange={onBankPinChange}
                    />
                  </FormControl>
                </>
              )}
            </AlertDialogBody>
            {/* {isError && <Text color="red">Please fill in all fields</Text>} */}
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setIsOpen(false);
                  setAccNo("");
                  setPin("");
                  setBankAccNo("");
                  setHolderName("");
                  setBankPin("");
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                ml={3}
                onClick={(e) => {
                  handleConfirmClick(e);
                  setIsOpen(false);
                  setAccNo("");
                  setPin("");
                  setBankAccNo("");
                  setHolderName("");
                  setBankPin("");
                }}
                isDisabled={
                  method === "Mobile Pay"
                    ? accNo === "" || pin === ""
                    : bankAccNo === "" || holderName === "" || bankPin === ""
                }
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
