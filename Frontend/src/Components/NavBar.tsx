
import { Box, Flex, Link, Spacer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
    isAuthenticated: boolean;
}

const NavBar = ({isAuthenticated}:Props) => {
    const [isAuth,setAuth] = useState(false);
    useEffect(() => {
        setAuth(isAuthenticated);
    }, [isAuthenticated]);
    const linkStyles = {
        textDecoration: 'none', // Remove underline
        _hover: {
          textDecoration: 'none', // Remove underline on hover
        },
      };

      const login= <Link as={RouterLink} to="/login" mx={2} {...linkStyles}>Login</Link>  
      return (
        <Flex p={4} bg="black" color="white">
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold" {...linkStyles}>
            Rail Sheba
          </Link>
          <Spacer/>
          <Box>
            <Link as={RouterLink} to="/" mx={2} {...linkStyles}>
              Home
            </Link>
            <Link as={RouterLink} to="/register" mx={2} {...linkStyles}>
              Register
            </Link>
            {!isAuth && login}
            <Link as={RouterLink} to="/contact" mx={2} {...linkStyles}>
              Contact
            </Link>
          </Box>
        </Flex>
      );
};

export default NavBar;