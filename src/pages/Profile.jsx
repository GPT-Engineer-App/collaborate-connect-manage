import { useParams } from "react-router-dom";
import { Container, Box, Heading, Text, Button, VStack, Image, Input, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const Profile = () => {
  const { id } = useParams();
  const { session } = useSupabaseAuth();
  const [profileData, setProfileData] = useState({ username: "", email: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session) {
      fetchProfileData();
    }
  }, [session]);

  const fetchProfileData = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, email, bio")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile data:", error);
    } else {
      setProfileData(data);
    }
  };

  const handleProfileUpdate = async () => {
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      alert("Profile updated successfully!");
      setIsEditing(false);
    }
  };

  if (!session) {
    return <Text>You need to be logged in to view your profile.</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Image src={profileData.avatar_url} alt={profileData.username} boxSize="150px" borderRadius="full" />
        <Heading as="h1" size="xl">{profileData.username}</Heading>
        <Text fontSize="lg">{profileData.email}</Text>
        <Text>{profileData.bio}</Text>
        <Box>
          <Button colorScheme="blue" mr={3} onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </Box>
        {isEditing && (
          <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
            <Heading as="h2" size="lg" mb={4}>Edit Profile</Heading>
            <Input
              placeholder="Username"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
            <Textarea
              placeholder="Bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
            <Button colorScheme="blue" onClick={handleProfileUpdate}>Update Profile</Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Profile;