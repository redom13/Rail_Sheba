import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Link,
  Flex,
  Text,
  Divider,
  Button,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { set } from "lodash";
import axios from "axios";

interface Props {
  setAuth: (auth: boolean) => void;
  setIsLogged: (auth: boolean) => void;
}

const Profile = ({ setAuth, setIsLogged }: Props) => {
  const [user, setUser] = useState({
    NID: "",
    FIRST_NAME: "",
    LAST_NAME: "",
    DATE_OF_BIRTH: "",
    CONTACT_NO: "",
    EMAIL: "",
  });
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
    setOldPassword("");
    setNewPassword("");
  }
  const cancelRef = React.useRef(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const toast=useToast();

  const handleProfileClick = () => {
    navigate("/dashboard", { state: user });
  };

  const handleCancelReservationClick = () => {
    navigate("/cancelReservation",{state: user});
  };

  const handleUpdatePasswordClick = () => {
    setIsOpen(true);
    setOldPassword("");
    setNewPassword("");
  };

  const handleUpdatePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Update Password");
    try {
      axios.put("http://localhost:5000/api/v1/dashboard/updatePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
        },
        {
          headers: { jwtToken: localStorage.jwtToken },
        }
      ).then((response) => {
        console.log(response.data);
        if (response.data.success) {
          onClose();
          toast({
            title: "Password updated successfully",
            status: "success",
            duration: 3000, // Optional duration for the toast
            isClosable: true,
          });
        }
      });
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error updating password",
        description: error.message || "An error occurred",
        status: "error",
        duration: 3000, // Optional duration for the toast
        isClosable: true,
      });
    }
  };

  const handleLogoutClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
      setIsLogged(false);
      navigate("/");
    } catch (err: any) {
      console.error(err.message);
    }
  };

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

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {user.FIRST_NAME + " " + user.LAST_NAME}
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Flex alignItems="center">
            <EmailIcon boxSize={4} style={{ verticalAlign: "middle" }} />
            <Box ml={2}>
              <Text fontSize="md">{user.EMAIL}</Text>
            </Box>
          </Flex>
        </MenuItem>
        <MenuItem>
          <Flex alignItems="center">
            <PhoneIcon style={{ verticalAlign: "middle" }} />
            <Box ml={2}>
              <Text fontSize="md">{user.CONTACT_NO}</Text>
            </Box>
          </Flex>
        </MenuItem>
        <Divider mb={1} />
        <MenuItem>
          <Flex
            onClick={handleProfileClick}
            mt={0}
            alignItems="center"
            justifyContent="center"
            w="full"
          >
            Profile
          </Flex>
        </MenuItem>
        <MenuItem>
          <Flex
            onClick={handleCancelReservationClick}
            mt={0}
            alignItems="center"
            justifyContent="center"
            w="full"
          >
            Cancel Reservation
          </Flex>
        </MenuItem>
        <MenuItem>
          <Flex
            onClick={handleUpdatePasswordClick}
            mt={0}
            alignItems="center"
            justifyContent="center"
            w="full"
          >
            Update Password
          </Flex>
        </MenuItem>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Update Password
              </AlertDialogHeader>

              <AlertDialogBody>
                <FormControl id="old-password" isRequired>
                  <FormLabel>Old Password</FormLabel>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl id="new-password" isRequired mt={3}>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormControl>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleUpdatePassword}
                  ml={3}
                  isDisabled={oldPassword==="" || newPassword===""}
                >
                  Update
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <MenuItem>
          <Flex
            w="full"
            alignItems="center"
            justifyContent="center"
            onClick={(e) => {
              handleLogoutClick(e);
            }}
          >
            Logout
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Profile;
