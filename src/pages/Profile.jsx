import { useParams } from "react-router-dom";
import { Container, Box, Heading, Text, Button, VStack, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const serviceProviders = [
  { id: 1, name: "John Doe", category: "Plumbing", imageUrl: "https://via.placeholder.com/150", bio: "Experienced plumber with over 10 years in the industry.", contact: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", category: "Electrical", imageUrl: "https://via.placeholder.com/150", bio: "Certified electrician specializing in residential projects.", contact: "jane.smith@example.com" },
  { id: 3, name: "Mike Johnson", category: "Cleaning", imageUrl: "https://via.placeholder.com/150", bio: "Professional cleaner with a keen eye for detail.", contact: "mike.johnson@example.com" },
  { id: 4, name: "Emily Davis", category: "Landscaping", imageUrl: "https://via.placeholder.com/150", bio: "Landscape artist with a passion for creating beautiful gardens.", contact: "emily.davis@example.com" },
];

const Profile = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const foundProvider = serviceProviders.find((provider) => provider.id === parseInt(id));
    setProvider(foundProvider);
  }, [id]);

  if (!provider) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Image src={provider.imageUrl} alt={provider.name} boxSize="150px" borderRadius="full" />
        <Heading as="h1" size="xl">{provider.name}</Heading>
        <Text fontSize="lg">{provider.category}</Text>
        <Text>{provider.bio}</Text>
        <Box>
          <Button colorScheme="blue" mr={3}>Book Now</Button>
          <Button colorScheme="teal">Chat</Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile;