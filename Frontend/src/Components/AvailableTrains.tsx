import {
  Box,
  Heading,
  List,
  ListItem,
  Link,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams,Link as RouterLink } from "react-router-dom";
import { taka } from "../Constants";

// interface QueryParams {
//   [key: string]: string | null;
// }

type train = {
  train_id: number;
  name: string;
};
// Custom hook to extract URL query parameters
// function useQueryParams(): QueryParams {
//   const [queryParams, setQueryParams] = useState<QueryParams>({});

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const params: QueryParams = {};
//     for (const [key, value] of searchParams) {
//       params[key] = value;
//     }
//     setQueryParams(params);
//   }, []);

//   return queryParams;
// 



function AvailableTrains() {
  const navigate = useNavigate();
  const { date, classType, source, destination } = useParams();
  const selectedDate = date ? new Date(date) : null;
  //const [trains, setTrains] = useState<train[]>([]);
  const [train, setTrain] = useState<train | null>(null); // [1
  const [filter, setFilter] = useState({
    source: "",
    destination: "",
    date: selectedDate,
    classType: "",
  });
  const trains = [
    {
      train_id: 765,
      name: "Nilsagar Express",
      seat: [
        { classType: "S_CHAIR", fare: `${taka}490` },
        { classType: "Snigdha", fare: `${taka}770` },
        { classType: "AC_S", fare: `${taka}1150` },
      ],
    },
    {
      train_id: 795,
      name: "Benapole Express",
      seat: [
        { classType: "S_CHAIR", fare: `${taka}490` },
        { classType: "Snigdha", fare: `${taka}770` },
      ],
    },
  ];
  //const queryParams = useQueryParams();

  // useEffect(() => {
  //   initialize();
  // }, []);
  return (
    <Box>
      <Heading as="h2" mb="4" mt='8px' marginLeft="10px">
        Available Trains
      </Heading>
      <p>{train?.name}</p>
      {/*<List spacing={3} mb="4">
        {trains.map((train, index) => (
          <ListItem key={index}>
            <Link href={`/trains/${train.train_id}`}>{train.name}</Link>
          </ListItem>
        ))}
      </List>*/}
      {trains.map((train, index) => (
        <Box key={index} id={`train-${index}`} mt="4" marginLeft="10px">
          <Heading as="h1" size="md" color='brown'>
            {train.name}
          </Heading>
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            mt="2"
          >
            {train.seat.map((seat, index) => (
              <Card key={index} size="sm" backgroundColor='cornsilk' borderRadius='10px'>
                <CardHeader color='black'>
                  <Heading size="md"> {seat.classType}</Heading>
                  <Text>{seat.fare}</Text>
                  <Text size="sm">Including VAT</Text>
                </CardHeader>
                <CardBody>
                  <Text>Available Tickets Counter+Online</Text>
                </CardBody>
                <CardFooter display='flex' justifyContent='center' alignContent='center'>
                  <Link as={RouterLink} to={`/trains/${train.train_id}`}>
                  <Button colorScheme="teal" borderRadius="20px">Book Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  );
}

export default AvailableTrains;
