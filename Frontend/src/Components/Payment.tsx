import React, { useState } from "react";
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
import { set } from "lodash";

const Payment = () => {
  const [payableAmount, setPayableAmount] = useState(100); // Set default payable amount
  const cancelRef = React.useRef(null);
  const [mobilePayMethod, setMobilePayMethod] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleMobileClick = (method: string) => {
    setMobilePayMethod(method);
    setIsOpen(true);
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Payable Amount: ${payableAmount}
      </Text>

      <Tabs variant="soft-rounded" colorScheme="teal">
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
                <Input placeholder={`Enter ${mobilePayMethod} number`} />
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
              <Button colorScheme="blue" ml={3}>
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
