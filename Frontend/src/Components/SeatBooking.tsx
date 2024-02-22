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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";

interface Props {
  number: number;
  name: string;
}

const BoxComponent = ({
  number,
  name,
  updateSeatCount,
}: Props & { updateSeatCount: (clicked: boolean) => void }) => {
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
    >
      <Center>{name}</Center>
      <Center>{number}</Center>
    </Box>
  );
};

// Props for seatBooking
interface Props2 {
  trainID: Number;
  className: string;
  fromStation: string;
  toStation: string;
  selectedDate: Date;
}

type Seat = {
  compName: string;
  no: Number;
};

type Compartment = {
  compId: Number;
  compName: string;
};

const SeatBooking = ({
  trainID,
  className,
  fromStation,
  toStation,
  selectedDate,
}: Props2) => {
  const [seatCount, setSeatCount] = useState(0);
  const [compartments, setCompartments] = useState<Compartment[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat[]>([]);
  const [selectedCompartment, setSelectedCompartment] = useState<string>("");
  const [bookedSeats, setBookedSeats] = useState<Seat[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  //const { id, className2 } = useParams();
  const getBookedSeats = async (compId: Number) => {
    try {
      console.log("CALLED");
      const response = await axios.get(
        `http://localhost:5000/api/v1/reservation/bookedSeats`,
        { params: { compId, selectedDate } }
      );
      console.log(response.data);
      let bs = [];
      //if (response.data)
      for (let tmp of response.data) {
        console.log(tmp)
        bs.push({ compName: tmp.COMPARTMENT_NAME, no: tmp.SEAT_NO });
      }
      console.log("bs:",bs)
      console.log("Booked Seats Previously:",bookedSeats)
      setBookedSeats([...bs,...bookedSeats]);
    } catch (err) {
      console.log(err);
    }
  };
  const getCompartments = (id: Number, className: string) => {
    axios
      .get(`http://localhost:5000/api/v1/compartments/${trainID}/${className}`)
      .then((response) => {
        let comp_name: Compartment[] = []; // Explicitly define the type of comp_name
        for (let tmp of response.data) {
          comp_name.push({
            compId: tmp.COMPARTMENT_ID,
            compName: tmp.COMPARTMENT_NAME,
          });
        }
        setCompartments(comp_name);
        // Call getBookedSeats after setting compartments
        comp_name.forEach(comp => getBookedSeats(comp.compId));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    console.log("Booked seats:", bookedSeats);
  }, [bookedSeats]);

  useEffect(() => {
    if (trainID && className) getCompartments(Number(trainID), className);
  }, []);

  // useEffect(() => {
  //   if (compartments) {
  //     for (let comp of compartments) {
  //       getBookedSeats(comp.compId);
  //     }
  //   }
  //   console.log("BOOKED SEATS:", bookedSeats);
  // },[compartments]);

  // useEffect(()=>
  // {
  //   if( trainID )
  // },[])
  useEffect(() => {
    // Reset seat count to zero when selectedCompartment changes
    setSeatCount(0);
  }, [selectedCompartment]);

  // useEffect(() => {
  //   const {id,className}=location.state;
  //   getCompartments(id,className);
  // },[location.state]);

  const updateSeatCount = (clicked: boolean) => {
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
              <Select
                value={selectedCompartment}
                onChange={(e) => setSelectedCompartment(e.target.value)}
              >
                {compartments?.map((compartment) => (
                  <option
                    key={compartment.compName}
                    value={compartment.compName}
                  >
                    {compartment.compName}
                  </option>
                ))}
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
                templateRows="repeat(9, 1fr)" // Add an extra row for the gap
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
                    rowSpan={index === 20 ? 2 : 1} // Set rowSpan to 2 for the gap row
                  >
                    <BoxComponent
                      number={index + 1}
                      name={selectedCompartment}
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
