import {
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

type RouteStat = {
  FROM_STATION: string;
  TO_STATION: string;
  PASSENGER_CT: number;
};

const Statistics = () => {
  const [routes, setRoutes] = useState<RouteStat[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const getRoutes = () => {
    try {
      axios
        .get(`http://localhost:5000/api/v1/stats/routes`, { params: { year } })
        .then((response) => {
          console.log(response.data);
          setRoutes(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoutes();
  }, [year]);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <VStack mt={4}>
      <Select
        placeholder="Select year"
        onChange={(e) => setYear(Number(e.target.value))}
        defaultValue={year}
        w="40%"
      >
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </Select>
      {routes.length === 0 ? (
        <Text fontSize="xl">
          <strong>No reservation in {year}</strong>
        </Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th bg="blue.500" color="white">
                From Station
              </Th>
              <Th bg="blue.500" color="white">
                To Station
              </Th>
              <Th bg="blue.500" color="white" isNumeric>
                No of Reservation(s)
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {routes.map((route, index) => (
              <Tr key={index}>
                <Td>{route.FROM_STATION}</Td>
                <Td>{route.TO_STATION}</Td>
                <Td isNumeric>{route.PASSENGER_CT}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
};

export default Statistics;
