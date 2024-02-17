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
import { Link as RouterLink,useLocation } from "react-router-dom";
import Profile from "./Profile";

interface Props {
  isAuthenticated: boolean;
  isLoginPage:boolean;
}

const NavBar = ({ isAuthenticated,isLoginPage }: Props) => {
  const [isAuth, setAuth] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setAuth(isAuthenticated);
    console.log("NavBar isAuthenticated:", isAuth);
  }, [isAuthenticated]);
  const linkStyles = {
    textDecoration: "none", // Remove underline
    _hover: {
      textDecoration: "none", // Remove underline on hover
    },
  };

  const getIndex=()=>{
    if(location.pathname==="/") return 0;
    if(location.pathname==="/register") return 1;
    if(location.pathname==="/login") return 2;
    if(location.pathname==="/contact") return 3;
  }

  const login = (
    <Link as={RouterLink} to="/login" mx={2} {...linkStyles}>
      <Tab>Login</Tab>
    </Link>
  );
  return !isLoginPage && (
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
      <Tabs position="relative" variant="unstyled" defaultIndex={getIndex()}>
        <TabList>
          <Link as={RouterLink} to="/" mx={2} {...linkStyles}>
            <Tab>Home</Tab>
          </Link>
          <Link as={RouterLink} to="/register" mx={2} {...linkStyles}>
            <Tab>Register</Tab>
          </Link>
          {!isAuth && login}
          <Link as={RouterLink} to="/contact" mx={2} {...linkStyles}>
            <Tab>Contact</Tab>
          </Link>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="1.5px"
          bg="teal.500"
          borderRadius="1px"
        />
      </Tabs>
      {isAuth && <Profile/>}
    </Flex>
  );
};

export default NavBar;
