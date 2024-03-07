import {
  Box,
  Flex,
  Link,
  Spacer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Profile from "./Profile";

interface Props {
  isLogged: boolean;
  isLoginPage: boolean;
  setAuth: (auth: boolean) => void;
  setIsLogged: (auth: boolean) => void;
}

const NavBar = ({ isLogged, isLoginPage, setAuth, setIsLogged }: Props) => {
  const [logged, setLogged] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setLogged(isLogged);
    console.log("NavBar isLogged:", isLogged);
  }, [isLogged]);
  const linkStyles = {
    textDecoration: "none", // Remove underline
    _hover: {
      textDecoration: "none", // Remove underline on hover
    },
  };

  const getIndex = () => {
    console.log("Location in Navbar:", location.pathname);
    if (location.pathname === "/") return 0;
    if (location.pathname === "/register") return 1;
    if (location.pathname === "/login") return 2;
    if (location.pathname === "/contact") return 3;
  };
  const [tabIndex, setTabIndex] = useState(getIndex());

  useEffect(() => {
    setTabIndex(getIndex());
  }, [location.pathname]);

  const login = (
    <Link as={RouterLink} to="/login" mx={2} {...linkStyles}>
      <Tab>Login</Tab>
    </Link>
  );
  return (
    <Flex p={4} bg="white" color="black" boxShadow="lg">
      <Link
        as={RouterLink}
        to="/"
        fontSize="xl"
        fontWeight="bold"
        {...linkStyles}
      >
        Rail Sheba
      </Link>
      <Spacer />
      <Tabs position="relative" variant="unstyled" defaultIndex={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Link as={RouterLink} to="/" mx={2} {...linkStyles}>
            <Tab>Home</Tab>
          </Link>
          <Link as={RouterLink} to="/register" mx={2} {...linkStyles}>
            <Tab>Register</Tab>
          </Link>
          {!logged && login}
          <Link as={RouterLink} to="/statistics" mx={2} {...linkStyles}>
            <Tab>Statistics</Tab>
          </Link>
          <Link as={RouterLink} to="/TrainInfo" mx={2} {...linkStyles}>
            <Tab>Train Information</Tab>
          </Link>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="1.5px"
          bg="teal.500"
          borderRadius="1px"
        />
      </Tabs>
      {logged && <Profile setAuth={setAuth} setIsLogged={setIsLogged} />}
    </Flex>
  );
};

export default NavBar;
