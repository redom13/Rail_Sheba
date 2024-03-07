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
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {Bar} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);

type RouteStat = {
  FROM_STATION: string;
  TO_STATION: string;
  PASSENGER_CT: number;
};

type WeekStat = {
    DAY_OF_WEEK: number;
    RESERVATION_CT: number;
  };

const Statistics = () => {
  const [routes, setRoutes] = useState<RouteStat[]>([]);
  //const [year, setYear] = useState(new Date().getFullYear());
  const [criteria, setCriteria] = useState("all time");
  const [weekStats, setWeekStats] = useState<WeekStat[]>([]);

  const getRoutes = () => {
    try {
      axios
        .get(`http://localhost:5000/api/v1/stats/routes`, { params: { criteria } })
        .then((response) => {
          console.log(response.data);
          setRoutes(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getWeekStats = () => {
    try {
      axios
        .get(`http://localhost:5000/api/v1/stats/weekly`)
        .then((response) => {
          console.log(response.data);
          setWeekStats(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoutes();
  }, [criteria]);

  useEffect(() => {
    getWeekStats();
  }, []);

//   const years = Array.from(
//     { length: 5 },
//     (_, i) => new Date().getFullYear() - i
//   );
const criteriaOptions = ["today", "this week", "this month", "this year", "all time"];

const weekStatData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: '# of Reservations',
        data: weekStats.map((stat) => stat.RESERVATION_CT),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
        yAxes:[ 
        {
            ticks:{
            beginAtZero: true,
            }
        }
    ],
    legend: {
        labels: {
            fontSize: 15,
        },
    },
    },
  };

return (
    <Center>
    <VStack mt={4} w="80%">
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Top Routes Statistics 
        </Text>
      <Select onChange={(e) => setCriteria(e.target.value)} defaultValue={criteria} w="40%">
            {criteriaOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </Select>
        <Table variant="simple" borderWidth="1px" border="solid" borderColor="blue.500">
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
        <Bar data={weekStatData} key={Math.random()}/>
    </VStack>
    </Center>
  );
};

export default Statistics;
