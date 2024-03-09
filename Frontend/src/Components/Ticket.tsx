import { Table, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { groupBy } from "lodash";
import { taka } from "../Constants";
import axios from "axios";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type seat = {
  compId: Number;
  no: Number;
};

type Filter = {
  pnr: string;
  fromStation: string;
  toStation: string;
  TRAIN_ID: Number;
  trainName: string;
  selectedDate: Date;
  className: string;
  SEATS: seat[];
  TOTAL_FARE: Number;
  issueDate: Date;
  FROM_DEPARTURE: string;
};

const Ticket = () => {
  const location = useLocation();
  const [compartmentMap, setCompartmentMap] = useState(new Map());
  const [filter, setFilter] = useState<Filter>({
    pnr: "",
    fromStation: "",
    toStation: "",
    TRAIN_ID: 0,
    trainName: "",
    selectedDate: new Date(),
    className: "",
    SEATS: [],
    TOTAL_FARE: 0,
    issueDate: new Date(),
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
  useEffect(() => {
    // Retrieve data from location state
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
      FROM_DEPARTURE,
    } = location.state;
    setFilter({
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
      FROM_DEPARTURE,
    });
    getCompartmentName(TRAIN_ID, className);
    console.log(
      "INSIDE USE EFFECT:",
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
      FROM_DEPARTURE
    );
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

      console.log("Map:", newCompartmentMap);

      setCompartmentMap(newCompartmentMap);

      console.log("Map:", compartmentMap);
    } catch (err) {
      console.error(err);
    }
  }
  const groupedSeats = groupBy(filter.SEATS, "compId");

  const downloadPdf = () => {
    const input = document.getElementById('ticket-container');
  
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('ticket.pdf');
      });
    } else {
      console.error('Could not find element with id "ticket-container"');
    }
  };

  return (
    <div>
    <div id="ticket-container">
    <p style={{ width: "70%", margin: "auto", marginBottom: "20px", textAlign: "justify", lineHeight: "1.6",fontWeight:"bold" }}>
      Dear {user.FIRST_NAME + " " + user.LAST_NAME}, Your request to book
      e-ticket for your journey in Bangladesh Railway was successful. You can
      travel on the train mentioned in the ticket subject to showing your NID
      or Photo ID card. The details of your e-ticket are as below:
    </p>
      <Table
      mt={10}
        variant="striped"
        style={{
          width: "70%",
          margin: "auto",
        }}
      >
        <Tbody border="solid" borderColor="teal.500">
          <Thead>
            <Tr>
              <Th colSpan={2} style={{ fontSize: "20px" }}>
                Journey Information
              </Th>
            </Tr>
          </Thead>
          <Tr>
            <Td fontWeight="bold">PASSENGER NAME</Td>
            <Td>{user.FIRST_NAME + " " + user.LAST_NAME}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">PNR</Td>
            <Td>{filter.pnr}</Td>
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
            <Td>{filter.trainName + " (" + filter.TRAIN_ID + ")"}</Td>
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
          {/* <Tr>
                <Td fontWeight="bold">ISSUE DATE</Td>
                <Td>{formattedDate}</Td>
              </Tr> */}
        </Tbody>
      </Table>
      <Table
        variant="striped"
        style={{ marginTop: "100px", width: "70%", margin: "auto" }}
      >
        <Thead>
          <Tr>
            <Th colSpan={2}>Passenger Information</Th>
          </Tr>
        </Thead>
        <Tbody border="solid" borderColor="teal.500">
          <Tr>
            <Td fontWeight="bold">NID</Td>
            <Td>{user.NID}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">First Name</Td>
            <Td>{user.FIRST_NAME}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">Last Name</Td>
            <Td>{user.LAST_NAME}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">Date of Birth</Td>
            <Td>{user.DATE_OF_BIRTH}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">Contact No</Td>
            <Td>{user.CONTACT_NO}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">Email</Td>
            <Td>{user.EMAIL}</Td>
          </Tr>
        </Tbody>
      </Table>
      </div>
      <button style={{ float: "right", marginRight: "10px", marginTop: "20px",marginBottom:"10px", padding: "10px 20px", backgroundColor: "#319795", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={downloadPdf}>Download PDF</button>
    </div>
  );
};

export default Ticket;
