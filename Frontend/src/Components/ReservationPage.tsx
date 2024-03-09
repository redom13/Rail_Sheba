import { sha256 } from "crypto-hash";
import { v4 as uuidv4 } from "uuid";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { groupBy } from "lodash";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Box,
  Stack,
  StackDivider,
  Text,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { taka } from "../Constants";
import backgroundImage from "../reservation-img.jpg";

type seat = {
  compId: Number;
  no: Number;
};

type Filter = {
  fromStation: string;
  toStation: string;
  selectedDate: Date;
  className: string;
  TRAIN_ID: Number;
  TOTAL_FARE: Number;
  SEATS: seat[];
  FROM_DEPARTURE: string;
};

const ReservationPage = () => {
  const navigate = useNavigate();
  const [trainName, setTrainName] = useState("");
  const [compartmentMap, setCompartmentMap] = useState(new Map());
  const issueDate = new Date();
  const day = String(issueDate.getDate()).padStart(2, "0");
  const month = String(issueDate.getMonth() + 1).padStart(2, "0");
  const year = issueDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const [seats, setSeats] = useState<seat[]>([]);
  const [filter, setFilter] = useState<Filter>({
    fromStation: "",
    toStation: "",
    selectedDate: issueDate,
    className: "",
    TRAIN_ID: 0,
    TOTAL_FARE: 0,
    SEATS: [],
    FROM_DEPARTURE: "",
  });
  const [user, setUser] = useState({
    NID: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    DATE_OF_BIRTH: "",
    CONTACT_NO: "",
    EMAIL: "",
  });
  const [pnr, setPnr] = useState<string>("");
  const location = useLocation();
  useEffect(() => {
    // Retrieve data from location state
    const {
      trainID,
      className,
      fromStation,
      toStation,
      selectedDate,
      selectedSeat,
      fare,
      FROM_DEPARTURE,
    } = location.state;
    console.log("INSIDE USE EFFECT:",
      fromStation,
      toStation,
      selectedDate,
      className,
      trainID,
      selectedSeat,
      fare,
      FROM_DEPARTURE,
    );
    //console.log("selected date of available trains",selectedDate)
    // You can now use this data to set your component state or perform any necessary operations
    setFilter({
      fromStation: fromStation,
      toStation: toStation,
      selectedDate: new Date(selectedDate),
      className: className,
      TRAIN_ID: trainID,
      TOTAL_FARE: fare,
      SEATS: selectedSeat,
      FROM_DEPARTURE: FROM_DEPARTURE,
    });
    getTrainName(trainID);
    getCompartmentName(trainID, className);
  }, []);

  useEffect(() => {
    setPnr(generatePNR());
  }, []);
  // function generatePNR(trainID: any, fromStation: any, toStation: any) {
  //   // const timestamp = Date.now(); // Current timestamp
  //   // const randomComponent = Math.random().toString(36).substring(7); // Random string
  //   // const combinedString = `${trainID}-${fromStation}-${toStation}-${timestamp}-${randomComponent}`;

  //   // // Generate SHA-256 hash
  //   // return sha256(combinedString);
  //   const timestamp = Date.now().toString(36).slice(-5); // Extract last 5 characters of current timestamp
  //   const randomChars = Math.random().toString(36).slice(-5); // Generate random characters
  //   return timestamp + randomChars; // Combine timestamp and random characters
  // }

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
  function generatePNR() {
    return uuidv4();
  }
  async function getTrainName(trainID: Number) {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/trains/${trainID}`
      );
      console.log(res.data);
      //setFilter({...filter,TRAIN_NAME:res.data.TRAIN_NAME})
      setTrainName(res.data.data[0]?.TRAIN_NAME);
      console.log("inside getTrainName :", trainName, trainID);
    } catch (err) {
      console.error(err);
    }
  }

  async function getCompartmentName(trainID: Number, className: string) {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/compartments/${trainID}/${className}`
      );
      console.log("inside getCompartmentName :", trainID, className);
      console.log("inside getCompartmentName :", res.data);

      const newCompartmentMap = new Map();
      res.data.forEach(
        (compartment: { COMPARTMENT_ID: number; COMPARTMENT_NAME: string }) => {
          newCompartmentMap.set(
            compartment.COMPARTMENT_ID,
            compartment.COMPARTMENT_NAME
          );
        }
      );

      setCompartmentMap(newCompartmentMap);

      console.log("Map:", compartmentMap);
    } catch (err) {
      console.error(err);
    }
  }

  const groupedSeats = groupBy(filter.SEATS, "compId");
  return (
    <div
      style={
        {
          //  backgroundImage: `url(${backgroundImage})`,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          //   backgroundColor: "teal",
          //   width: '100vw',
          //   height: '100vh',
          //   display: 'flex',
          //   justifyContent: 'center',
          //   alignItems: 'center',
        }
      }
    >
      <Card
        style={{
          width: "50%",
          margin: "auto",
          marginTop: "4px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        }}
      >
        <CardHeader>
          <Heading size="md" fontSize={50} textAlign="center">
            JOURNEY DETAILS
          </Heading>
        </CardHeader>

        <CardBody>
          <Table variant="striped">
            <Tbody border="solid" borderColor="teal.500">
              <Tr>
                <Td fontWeight="bold">PASSENGER NAME</Td>
                <Td>{user.FIRST_NAME + " " + user.LAST_NAME}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">PNR</Td>
                <Td>{pnr}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">FROM STATION</Td>
                <Td>{filter.fromStation}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">TO STATION</Td>
                <Td>{filter.toStation}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">TRAIN NAME</Td>
                <Td>{trainName + " (" + filter.TRAIN_ID + ")"}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">DATE OF JOURNEY</Td>
                <Td>{filter.selectedDate.toDateString()}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">DEPARTURE TIME</Td>
                <Td>{filter.FROM_DEPARTURE}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">CLASS NAME</Td>
                <Td>{filter.className}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">SEATS</Td>
                <Td>
                  {Object.entries(groupedSeats).map(([compId, seats]) => (
                    <Text key={compId}>
                      {compartmentMap.get(Number(compId))} {"["}seat(s):{" "}
                      {seats.map((seat: any) => seat.no).join(", ")}
                      {"]"}
                    </Text>
                  ))}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">TOTAL FARE</Td>
                <Td>{`${taka} ${filter.TOTAL_FARE}`}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">ISSUE DATE</Td>
                <Td>{formattedDate}</Td>
              </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
      <Button
        rightIcon={<ArrowForwardIcon />}
        colorScheme="red"
        loadingText='Submitting'
        // spinner={<BeatLoader size={8} color='white' />}
        variant="outline"
        style={{
          position: "absolute",
          bottom: "10px", // Adjust as needed
          right: "10px", // Adjust as needed
        }}
        onClick={() =>
          navigate("/payment", {
            state: {
              pnr: pnr,
              fromStation: filter.fromStation,
              toStation: filter.toStation,
              TRAIN_ID: filter.TRAIN_ID,
              trainName: trainName,
              selectedDate: filter.selectedDate,
              className: filter.className,
              SEATS: filter.SEATS,
              TOTAL_FARE: filter.TOTAL_FARE,
              issueDate: formattedDate,
              FROM_DEPARTURE: filter.FROM_DEPARTURE,
            },
          })
        }
      >
        Proceed to pay
      </Button>
      {/* <Button onClick={downloadPdf}>Download PDF</Button> */}
    </div>
  );
};

export default ReservationPage;
