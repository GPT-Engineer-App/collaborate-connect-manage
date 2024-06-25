import { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Select, SimpleGrid, Box, Heading, Image, Button, HStack, IconButton, Flex, List, ListItem } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";
import Map from '../components/Map';
import { FaHome, FaStar, FaEnvelope, FaUser, FaCog, FaWrench, FaBolt, FaBroom, FaTree } from 'react-icons/fa';

const categories = [
  { name: "All", icon: FaHome },
  { name: "Plumbing", icon: FaWrench },
  { name: "Electrical", icon: FaBolt },
  { name: "Cleaning", icon: FaBroom },
  { name: "Landscaping", icon: FaTree },
];

const Index = () => {
  const { session } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [radius, setRadius] = useState(1000);
  const [providers, setProviders] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [autoSuggestions, setAutoSuggestions] = useState([]);

  const handleAddFavorite = async (providerId) => {
    if (!session) {
      alert("You need to be logged in to add favorites.");
      return;
    }

    try {
      const { error } = await supabase
        .from("favorites")
        .insert([{ user_id: session.user.id, provider_id: providerId }]);

      if (error) throw error;
      alert("Added to favorites!");
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const fetchProvidersWithinRadius = async (center, radius) => {
    try {
      const { data, error } = await supabase
        .rpc('get_providers_within_radius', { center_lat: center[0], center_lng: center[1], radius });

      if (error) {
        console.error('Error:', error);
        throw error;
      }
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  useEffect(() => {
    fetchProvidersWithinRadius(mapCenter, radius);
  }, [mapCenter, radius]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!searchHistory.includes(term)) {
      setSearchHistory([...searchHistory, term]);
    }
    // Fetch auto-suggestions based on the term
    const suggestions = providers.filter(provider => provider.name.toLowerCase().includes(term.toLowerCase()));
    setAutoSuggestions(suggestions);
  };

  const filteredProviders = providers.filter(provider => {
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
          onChange={(e) => handleSearch(e.target.value)}
        />
        {autoSuggestions.length > 0 && (
          <List spacing={2} width="100%">
            {autoSuggestions.map((suggestion, index) => (
              <ListItem key={index} onClick={() => setSearchTerm(suggestion.name)}>
                {suggestion.name}
              </ListItem>
            ))}
          </List>
        )}
        <Select
          placeholder="Select category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.name} value={category.name}>{category.name}</option>
          ))}
        </Select>
        <Flex wrap="wrap" justify="center">
          {categories.map(category => (
            <Button key={category.name} leftIcon={<category.icon />} onClick={() => setSelectedCategory(category.name)}>
              {category.name}
            </Button>
          ))}
        </Flex>
        <Map onRadiusChange={setRadius} onCenterChange={setMapCenter} />
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} width="100%">
          {filteredProviders.map(provider => (
            <Box key={provider.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={provider.imageUrl} alt={provider.name} />
              <Box p={5}>
                <Heading as="h3" size="md">{provider.name}</Heading>
                <Text>Rating: {provider.rating}</Text>
                <Text>Distance: {provider.distance} km</Text>
                <Text>Service Type: {provider.category}</Text>
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