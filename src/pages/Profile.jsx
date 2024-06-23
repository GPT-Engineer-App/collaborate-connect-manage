import { useParams } from "react-router-dom";
import { Container, Box, Heading, Text, Button, VStack, Image, Input, Textarea, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const serviceProviders = [
  { id: 1, name: "John Doe", category: "Plumbing", imageUrl: "https://via.placeholder.com/150", bio: "Experienced plumber with over 10 years in the industry.", contact: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", category: "Electrical", imageUrl: "https://via.placeholder.com/150", bio: "Certified electrician specializing in residential projects.", contact: "jane.smith@example.com" },
  { id: 3, name: "Mike Johnson", category: "Cleaning", imageUrl: "https://via.placeholder.com/150", bio: "Professional cleaner with a keen eye for detail.", contact: "mike.johnson@example.com" },
  { id: 4, name: "Emily Davis", category: "Landscaping", imageUrl: "https://via.placeholder.com/150", bio: "Landscape artist with a passion for creating beautiful gardens.", contact: "emily.davis@example.com" },
];

const Profile = () => {
  const { id } = useParams();
  const { session } = useSupabaseAuth();
  const [provider, setProvider] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ username: "", email: "", bio: "" });
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    const foundProvider = serviceProviders.find((provider) => provider.id === parseInt(id));
    setProvider(foundProvider);
    if (session) {
      fetchProfileData();
      fetchServices();
      fetchAvailability();
    }
  }, [id, session]);

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

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(data);
    }
  };

  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from("availability")
      .select("availability")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching availability:", error);
    } else {
      setAvailability(data.availability);
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

  const handleServiceAdd = async (newService) => {
    const { error } = await supabase
      .from("services")
      .insert([{ user_id: session.user.id, ...newService }]);

    if (error) {
      console.error("Error adding service:", error);
    } else {
      fetchServices();
    }
  };

  const handleServiceRemove = async (serviceId) => {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("user_id", session.user.id)
      .eq("id", serviceId);

    if (error) {
      console.error("Error removing service:", error);
    } else {
      fetchServices();
    }
  };

  const handleAvailabilityUpdate = async () => {
    const { error } = await supabase
      .from("availability")
      .update({ availability })
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error updating availability:", error);
    } else {
      alert("Availability updated successfully!");
    }
  };

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
          <Button colorScheme="blue" mr={3} onClick={() => setIsEditing(true)}>Edit Profile</Button>
          <Button colorScheme="teal">Chat</Button>
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
        <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
          <Heading as="h2" size="lg" mb={4}>Services</Heading>
          {services.map((service) => (
            <Box key={service.id} p={2} borderWidth="1px" borderRadius="lg" mb={2}>
              <Text>{service.name}</Text>
              <Button colorScheme="red" onClick={() => handleServiceRemove(service.id)}>Remove</Button>
            </Box>
          ))}
          <Button colorScheme="green" onClick={() => handleServiceAdd({ name: "New Service" })}>Add Service</Button>
        </Box>
        <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
          <Heading as="h2" size="lg" mb={4}>Availability</Heading>
          <Textarea
            placeholder="Enter your availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleAvailabilityUpdate}>Update Availability</Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile;