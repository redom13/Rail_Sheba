
import { Box, Flex, Link, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
    const linkStyles = {
        textDecoration: 'none', // Remove underline
        _hover: {
          textDecoration: 'none', // Remove underline on hover
        },
      };
      return (
        <Flex p={4} bg="teal.500" color="white">
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold" {...linkStyles}>
            Rail Sheba
          </Link>
          <Spacer />
          <Box>
            <Link as={RouterLink} to="/" mx={2} {...linkStyles}>
              Home
            </Link>
            <Link as={RouterLink} to="/login" mx={2} {...linkStyles}>
              Login
            </Link>
            <Link as={RouterLink} to="/register" mx={2} {...linkStyles}>
              Register
            </Link>
            <Link as={RouterLink} to="/contact" mx={2} {...linkStyles}>
              Contact
            </Link>
          </Box>
        </Flex>
      );
};

export default NavBar;