import { Container, VStack, Heading, Box, Text } from "@chakra-ui/react";
import { useSupabaseAuth, SupabaseAuthUI } from "../integrations/supabase/auth.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Login</Heading>
        <Box width="100%">
          <SupabaseAuthUI />
        </Box>
      </VStack>
    </Container>
  );
};

export default Login;