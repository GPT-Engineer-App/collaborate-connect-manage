import { Box, Flex, IconButton } from "@chakra-ui/react";
import { FaHome, FaStar, FaEnvelope, FaUser, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Box position="fixed" bottom="0" width="100%" bg="white" boxShadow="md">
      <Flex justify="space-around" p={{ base: 2, md: 4 }} spacing={{ base: 2, md: 4 }}>
        <Link to="/">
          <IconButton icon={<FaHome />} aria-label="Home" />
        </Link>
        <Link to="/favorites">
          <IconButton icon={<FaStar />} aria-label="Favorites" />
        </Link>
        <Link to="/messages">
          <IconButton icon={<FaEnvelope />} aria-label="Messages" />
        </Link>
        <Link to="/profile">
          <IconButton icon={<FaUser />} aria-label="Profile" />
        </Link>
        <Link to="/settings">
          <IconButton icon={<FaCog />} aria-label="Settings" />
        </Link>
      </Flex>
    </Box>
  );
};

export default NavigationBar;