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
  Button,
} from "@chakra-ui/react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { taka } from "../Constants";

interface Props {
  number: number;
  name: string;
  isBooked: boolean;
  compId: Number;
}

const BoxComponent = ({
  number,
  name,
  isBooked,
  compId,
  setSeatCount,
  selectedSeats,
  setSelectedSeats,
}: Props & {
  setSeatCount: (count: number) => void;
  selectedSeats: Seat[];
  setSelectedSeats: (seats: Seat[]) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  const [selected, setSelected] = useState(
    selectedSeats.some((seat) => seat.compId === compId && seat.no === number)
  );
  //console.log("Selected Seats:", selectedSeats);
  setSeatCount(selectedSeats.length);
  //console.log("CompId:", compId, "Number:", number, "isBooked:", isBooked, "Clicked:", clicked, "SelectedSeats:", selectedSeats);
  const handleClick = () => {
    if (isBooked) {
      return; // Ignore clicks if the seat is booked
    }
    //updateSeatCount(selected);
    setClicked(!clicked);
    //setSelected(!selected);
    // If the seat is already selected, remove it from the array
    // Otherwise, add it to the array
    if (selected) {
      console.log("Removing seat:", number, "CompId:", compId);
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat.no !== number || seat.compId !== compId
        )
      );
      setSelected(false);
      setSeatCount(selectedSeats.length);
      //console.log("Selected Seats:", selectedSeats);
    } else {
      setSelectedSeats([...selectedSeats, { compId, no: number }]);
      setSelected(true);
      setSeatCount(selectedSeats.length);
      //console.log("Selected Seats:", selectedSeats);
    }
  };

  return (
    <Box
      w="50px"
      h="50px"
      color="white"
      onClick={handleClick}
      bg={isBooked ? "orange" : selected ? "teal" : "gray"} // Set bg to orange if the seat is booked
      borderRadius="20px"
      style={{ cursor: isBooked ? "not-allowed" : "pointer" }} // Show forbidden sign if the seat is booked
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
  compId: Number;
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
  const [selectedCompartment, setSelectedCompartment] = useState<Compartment>();
  const [bookedSeats, setBookedSeats] = useState<Seat[]>([]);
  const [fare, setFare] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  //const { id, className2 } = useParams();
  const getBookedSeats = async (trainId: Number) => {
    try {
      console.log("CALLED");
      const response = await axios.get(
        `http://localhost:5000/api/v1/reservation/bookedSeats`,
        { params: { trainId, selectedDate } }
      );
      console.log(response.data);
      let bs = [];
      //if (response.data)
      for (let tmp of response.data) {
        console.log(tmp);
        bs.push({ compId: tmp.COMPARTMENT_ID, no: tmp.SEAT_NO });
      }
      console.log("bs:", bs);
      console.log("Booked Seats Previously:", bookedSeats);
      setBookedSeats(bs);
      // setBookedSeats([...bs,...bookedSeats]);
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
        setSelectedCompartment(comp_name[0]);
        // Call getBookedSeats after setting compartments
        //comp_name.forEach(comp => getBookedSeats(comp.compId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFare = (
    fromStation: string,
    toStation: string,
    className: string
  ) => {
    axios
      .get(
        `http://localhost:5000/api/v1/fare/${fromStation}/${toStation}/${className}`
      )
      .then((response) => {
        console.log(response.data);
        console.log("Fare:", response.data[0].FARE);
        setFare(response.data[0].FARE);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   console.log("Booked seats:", bookedSeats);
  // }, [bookedSeats]);

  useEffect(() => {
    if (trainID && className) {
      getCompartments(Number(trainID), className);
      getBookedSeats(Number(trainID));
    }
    if (fromStation && toStation && className) {
      getFare(fromStation, toStation, className);
    }
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
  // useEffect(() => {
  //   // Reset seat count to zero when selectedCompartment changes
  //   setSeatCount(0);
  // }, [selectedCompartment]);

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
                value={selectedCompartment?.compName}
                onChange={(e) => {
                  const selectedCompName = e.target.value;
                  const selectedCompartment = compartments?.find(
                    (compartment) => compartment.compName === selectedCompName
                  );
                  setSelectedCompartment(selectedCompartment);
                  console.log("Selected Compartment:", selectedCompartment);
                }}
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
                    key={selectedCompartment?.compId + "" + index}
                    colStart={
                      index % 5 <= 2 ? (index % 5) + 1 : (index % 5) + 2
                    }
                    colSpan={1}
                    rowSpan={index === 20 ? 2 : 1} // Set rowSpan to 2 for the gap row
                  >
                    <BoxComponent
                      number={index + 1}
                      name={selectedCompartment?.compName || ""}
                      isBooked={bookedSeats.some(
                        (seat) =>
                          seat.no === index + 1 &&
                          seat.compId === selectedCompartment?.compId
                      )}
                      compId={selectedCompartment?.compId || 0}
                      setSeatCount={setSeatCount}
                      selectedSeats={selectedSeat}
                      setSelectedSeats={setSelectedSeat}
                    />
                  </GridItem>
                ))}
              </Grid>
            </div>
            <div>
              <Box w="400px" h="300px" bg="cornsilk" mt="20px" ml={2}>
                <Text fontSize="lg" margin="5px" fontWeight="bold">
                  Seat Details
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={0}>
                  <Box bg="azure" color="black" p={0} height="30px">
                    <Text fontSize="md" fontWeight="bold">
                      Class
                    </Text>
                  </Box>
                  <Box bg="azure" color="black" p={0} height="30px">
                    <Text fontSize="md" fontWeight="bold">
                      Seat
                    </Text>
                  </Box>
                  <Box bg="azure" color="black" p={0} height="30px">
                    <Text fontSize="md" fontWeight="bold">
                      Fare
                    </Text>
                  </Box>
                  {selectedSeat?.map((seat, index) => {
                    const compartment = compartments.find(
                      (comp) => comp.compId === seat.compId
                    );
                    return (
                      <React.Fragment key={index}>
                        <Text fontSize="md" mb="1px">
                          {className} {/* Replace with your className state */}
                        </Text>
                        <Text fontSize="md" mb="1px">
                          {compartment
                            ? `${compartment.compName} - ${seat.no}`
                            : "Compartment not found"}
                        </Text>
                        <Text fontSize="md" mb="1px">
                          {`${taka}${fare}`}
                          {/* Replace with your fare state */}
                        </Text>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </Box>
              <Box bg="azure">
                <Text fontSize="lg" margin="5px" fontWeight="bold">
                  Total Fare: {taka}
                  {fare * selectedSeat.length}
                </Text>
              </Box>
              <Button
                w="400px"
                colorScheme="green"
                margin="5px"
                borderRadius="20px"
                onClick={() =>
                  navigate("/reservation", {
                    state: {
                      trainID,
                      className,
                      fromStation,
                      toStation,
                      selectedDate,
                      selectedSeat,
                      fare: fare * selectedSeat.length,
                    },
                  })
                }
              >
                Continue Purchase
              </Button>
            </div>
          </Flex>
        </div>
      </Center>
    </Center>
  );
};

export default SeatBooking;
