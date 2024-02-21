import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Center,
  Flex,
  Text,
  Select,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate,useLocation } from "react-router-dom";import axios from "axios";


interface Props {
  number: number;
}

const BoxComponent = ({
  number,
  updateSeatCount,
}: Props & { updateSeatCount: (clicked:boolean) => void }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    updateSeatCount(clicked);
    setClicked(!clicked);
  };

  return (
    <Box
      w="50px"
      h="50px"
      color="white"
      bg={clicked ? "teal" : "gray"}
      borderRadius="20px"
      onClick={handleClick}
    ></Box>
  );
};

const SeatBooking = () => {
  const [seatCount, setSeatCount] = useState(0);
  const [compartments, setCompartments] = useState<string[]|null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getCompartments = (id:Number,className:string) => {
      axios
      .get(`http://localhost:5000/api/v1/compartments/${id}/${className}`)
      .then((response) => {
        console.log(response.data);
        setCompartments(response.data.data);
        console.log("Compartments:",compartments);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // useEffect(() => {
  //   const {id,className}=location.state;
  //   getCompartments(id,className);
  // },[location.state]);

  const updateSeatCount = (clicked:boolean) => {
    if (!clicked) setSeatCount(seatCount + 1);
    else setSeatCount(seatCount - 1);
  };

  return (
    <Center flexDirection="column">
      <Flex flexDirection="column">
        <Text fontSize="md" fontWeight="bold" ml={4} mb={0}>
          Choose your seat(s) - Maximum 4 seats can be booked at a time.
        </Text>
        <Divider orientation="horizontal" width="800px" mx={4} mb={4} mt={1} />
      </Flex>
      <Center flexDirection="column">
        <div>
          <Box fontSize="smaller">
            To know seat number(s), rest the cursor on your desired seat(s).
            Click on it to select or deselect.
          </Box>
          <Flex>
            <div>
              <Text fontSize="lg" fontWeight="bold">
                Select Coach
              </Text>
              <Select>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </Select>
              <Flex>
                <Flex mt={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Available
                  </Text>
                  <Box
                    w="20px"
                    h="20px"
                    bg="gray"
                    borderRadius="5px"
                    ml="5px"
                  ></Box>
                </Flex>
                <Spacer />
                <Flex mt={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Booked
                  </Text>
                  <Box
                    w="20px"
                    h="20px"
                    bg="orange"
                    borderRadius="5px"
                    ml="5px"
                  ></Box>
                </Flex>
                <Spacer />
                <Flex mt={2}>
                  <Text fontSize="sm" fontWeight="bold">
                    Selected
                  </Text>
                  <Box
                    w="20px"
                    h="20px"
                    bg="teal"
                    borderRadius="5px"
                    ml="5px"
                  ></Box>
                </Flex>
              </Flex>
              <Grid
                h="800px"
                w="400px"
                templateColumns="repeat(6, 1fr)"
                gap={4}
                p={4}
                boxShadow="lg"
              >
                {[...Array(50).keys()].map((index) => (
                  <GridItem
                    key={index}
                    colStart={
                      index % 5 <= 2 ? (index % 5) + 1 : (index % 5) + 2
                    }
                    colSpan={1}
                  >
                    <BoxComponent
                      number={index + 1}
                      updateSeatCount={updateSeatCount}
                    />
                  </GridItem>
                ))}
              </Grid>
            </div>
            <Box w="400px" h="300px" bg="cornsilk" mt="20px" ml={2}>
              <Text fontSize="lg" margin="5px">
                Seat Details {seatCount}
              </Text>
            </Box>
          </Flex>
        </div>
      </Center>
    </Center>
  );
};

export default SeatBooking;
