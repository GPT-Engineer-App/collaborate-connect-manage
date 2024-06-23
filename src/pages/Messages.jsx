import { useState, useEffect } from "react";
import { Container, VStack, HStack, Box, Text, Input, Button, Heading } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const Messages = () => {
  const { session } = useSupabaseAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("id, provider_id, providers (name)")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      setConversations(data);
    }
  };

  const fetchMessages = async (conversationId) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setSelectedConversation({ id: conversationId, messages: data });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const { error } = await supabase
      .from("messages")
      .insert([{ conversation_id: selectedConversation.id, sender_id: session.user.id, content: newMessage }]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
      fetchMessages(selectedConversation.id);
    }
  };

  if (!session) {
    return <Text>You need to be logged in to view your messages.</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Messages</Heading>
        <HStack spacing={{ base: 2, md: 4 }} width="100%">
          <VStack spacing={4} width="30%" align="stretch">
            {conversations.map((conversation) => (
              <Box
                key={conversation.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                cursor="pointer"
                onClick={() => fetchMessages(conversation.id)}
              >
                <Text>{conversation.providers.name}</Text>
              </Box>
            ))}
          </VStack>
          <VStack spacing={4} width="70%" align="stretch">
            {selectedConversation ? (
              <>
                <Box p={4} borderWidth="1px" borderRadius="lg" overflowY="auto" height="400px">
                  {selectedConversation.messages.map((message) => (
                    <Box key={message.id} p={2} bg={message.sender_id === session.user.id ? "blue.100" : "gray.100"} borderRadius="md">
                      <Text>{message.content}</Text>
                    </Box>
                  ))}
                </Box>
                <HStack spacing={{ base: 2, md: 4 }}>
                  <Input
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button colorScheme="blue" onClick={handleSendMessage}>Send</Button>
                </HStack>
              </>
            ) : (
              <Text>Select a conversation to view messages</Text>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Messages;