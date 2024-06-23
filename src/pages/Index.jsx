import { useState } from "react";
import { Container, Text, VStack, Input, Select, SimpleGrid, Box, Heading, Image, Button } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const serviceProviders = [
  { id: 1, name: "John Doe", category: "Plumbing", imageUrl: "https://via.placeholder.com/150" },
  { id: 2, name: "Jane Smith", category: "Electrical", imageUrl: "https://via.placeholder.com/150" },
  { id: 3, name: "Mike Johnson", category: "Cleaning", imageUrl: "https://via.placeholder.com/150" },
  { id: 4, name: "Emily Davis", category: "Landscaping", imageUrl: "https://via.placeholder.com/150" },
];

const categories = ["All", "Plumbing", "Electrical", "Cleaning", "Landscaping"];

const Index = () => {
  const { session } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleAddFavorite = async (providerId) => {
    if (!session) {
      alert("You need to be logged in to add favorites.");
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: session.user.id, provider_id: providerId }]);

    if (error) {
      console.error("Error adding favorite:", error);
    } else {
      alert("Added to favorites!");
    }
  };

  const filteredProviders = serviceProviders.filter(provider => {
    return (
      (selectedCategory === "All" || provider.category === selectedCategory) &&
      provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Find a Service Provider</Heading>
        <Input
          placeholder="Search for a provider"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          placeholder="Select category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <SimpleGrid columns={[1, 2, 3]} spacing={5} width="100%">
          {filteredProviders.map(provider => (
            <Box key={provider.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={provider.imageUrl} alt={provider.name} />
              <Box p={5}>
                <Heading as="h3" size="md">{provider.name}</Heading>
                <Text>{provider.category}</Text>
                <Button colorScheme="blue" onClick={() => handleAddFavorite(provider.id)}>Add to Favorites</Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Index;