import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { ChevronDownIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";

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

  const handleProfileClick = () => {
    navigate("/dashboard", { state: user });
  };

  const handleLogoutClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
          <Flex>
            <EmailIcon />
            <Text fontSize="md">{user.EMAIL}</Text>
          </Flex>
        </MenuItem>
        <MenuItem>
          <Flex>
            <PhoneIcon />
            <Text fontSize="md">{user.CONTACT_NO}</Text>
          </Flex>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Flex w="full">
            <Button onClick={handleProfileClick} w="full">
              Profile
            </Button>
          </Flex>
        </MenuItem>
        <MenuItem>
          <Flex w="full">
            <Button
              onClick={(e) => {
                handleLogoutClick(e);
              }}
              w="full"
            >
              Logout
            </Button>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Profile;
