import { useState, useEffect } from "react";
import { Container, VStack, Heading, Box, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const Favorites = () => {
  const { session } = useSupabaseAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from("favorites")
      .select("provider_id, providers (id, name, category, imageUrl)")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching favorites:", error);
    } else {
      setFavorites(data);
    }
  };

  const handleRemoveFavorite = async (providerId) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", session.user.id)
      .eq("provider_id", providerId);

    if (error) {
      console.error("Error removing favorite:", error);
    } else {
      fetchFavorites();
    }
  };

  if (!session) {
    return <Text>You need to be logged in to view your favorites.</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={{ base: 2, md: 4 }} width="100%">
        <Heading as="h1" size="xl">Your Favorites</Heading>
        {favorites.length === 0 ? (
          <Text>No favorite providers found.</Text>
        ) : (
          favorites.map(({ provider_id, providers }) => (
            <Box key={provider_id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%">
              <Image src={providers.imageUrl} alt={providers.name} />
              <Box p={5}>
                <Heading as="h3" size="md">{providers.name}</Heading>
                <Text>{providers.category}</Text>
                <Button colorScheme="red" onClick={() => handleRemoveFavorite(provider_id)}>Remove from Favorites</Button>
              </Box>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Favorites;