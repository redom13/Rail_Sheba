// RegistrationForm.js
import { SyntheticEvent, useState } from "react";
import { Button, Flex, FormControl, FormLabel, Input, Select, VStack, useToast } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  setAuth: (auth: boolean) => void;
}

const date=new Date();

interface DateOfBirthPickerProps {
  selected: Date | null;
  onChange: (date: Date | null, event: SyntheticEvent<any> | undefined) => void;
}

const DateOfBirthPicker = ({ selected, onChange }:DateOfBirthPickerProps) => (
  <DatePicker
    selected={selected}
    onChange={onChange}
    dateFormat="MM/dd/yyyy"
    showYearDropdown
    scrollableYearDropdown
    dropdownMode="select"
    placeholderText="Date Of Birth"
    className="form-control"
    maxDate={new Date()} // Optional: Set a max date to prevent future dates
  />
);

const RegistrationForm = ({setAuth}:Props) => {
  const [formData, setFormData] = useState({
    nid: "",
    first_name:"",
    last_name:"",
    date_of_birth:date,
    contact_no:"",
    idtype:"",
    email: "",
    password: "",
  });
  const toast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date_of_birth: date || new Date() });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/v1/auth/register", formData)
      .then((response) => {
        // Handle success
        console.log("Response:", response.data);
        if (response.data.jwtToken) {
          localStorage.setItem("jwtToken", response.data.jwtToken);
          setAuth(true);
        toast({
          title: "Account created successfully",
          status: "success",
          duration: 3000, // Optional duration for the toast
          isClosable: true,
        });
        }
        else {
          setAuth(false);
          toast({
            title: "Error creating account",
            description: response.data.message || "An error occurred",
            status: "error",
            duration: 3000, // Optional duration for the toast
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
        toast({
          title: "Error creating account",
          description: error.response.data.message || "An error occurred",
          status: "error",
          duration: 3000, // Optional duration for the toast
          isClosable: true,
        });
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <VStack spacing={4} width="300px">
        <Input
          type="text"
          name="nid"
          placeholder="NID"
          value={formData.nid}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="first_name"
          placeholder="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="last_name"
          placeholder="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
        {/*<Input
          type="text"
          name="date_of_birth"
          placeholder="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />*/}
        <FormControl>
        <FormLabel>Date of Birth</FormLabel>
        <DateOfBirthPicker selected={formData.date_of_birth} onChange={handleDateChange} />
        </FormControl>
        <Input
          type="text"
          name="contact_no"
          placeholder="contact_no"
          value={formData.contact_no}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Select
          name="idtype"
          placeholder="Choose your username"
          value={formData.idtype}
          onChange={handleChange}
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </Select>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit} colorScheme="teal">Sign Up</Button>
      </VStack>
    </div>
  );
};

export default RegistrationForm;
