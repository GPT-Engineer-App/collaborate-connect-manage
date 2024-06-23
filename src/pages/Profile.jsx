import { useParams } from "react-router-dom";
import { Container, Box, Heading, Text, Button, VStack, Image, Input, Textarea, HStack, Select, Switch, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";
import { FaEdit, FaTrash } from "react-icons/fa";

const Profile = () => {
  const { id } = useParams();
  const { session } = useSupabaseAuth();
  const [profileData, setProfileData] = useState({ username: "", email: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceData, setServiceData] = useState({ description: "", photos: [], paymentMethods: { free: false, favorBack: false, swish: false } });

  useEffect(() => {
    if (session) {
      fetchProfileData();
      fetchServices();
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

  const handleServiceUpdate = async () => {
    const { error } = await supabase
      .from("services")
      .update(serviceData)
      .eq("id", selectedService.id);

    if (error) {
      console.error("Error updating service:", error);
    } else {
      alert("Service updated successfully!");
      setSelectedService(null);
    }
  };

  const handleServiceDelete = async (serviceId) => {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      console.error("Error deleting service:", error);
    } else {
      fetchServices();
      setSelectedService(null);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setServiceData(service);
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
        <Heading as="h2" size="lg">Services</Heading>
        <HStack spacing={4} width="100%">
          {services.map(service => (
            <Box key={service.id} borderWidth="1px" borderRadius="lg" p={4} width="100%">
              <Heading as="h3" size="md">{service.name}</Heading>
              <Text>{service.description}</Text>
              <Button colorScheme="blue" onClick={() => handleServiceSelect(service)}>Edit</Button>
              <IconButton icon={<FaTrash />} aria-label="Delete" onClick={() => handleServiceDelete(service.id)} />
            </Box>
          ))}
        </HStack>
        {selectedService && (
          <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
            <Heading as="h2" size="lg" mb={4}>Edit Service</Heading>
            <Input
              placeholder="Description"
              value={serviceData.description}
              onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
            />
            <Heading as="h3" size="md" mb={2}>Photos</Heading>
            <HStack spacing={2}>
              {serviceData.photos.map((photo, index) => (
                <Box key={index} position="relative">
                  <Image src={photo} alt={`Photo ${index + 1}`} boxSize="100px" borderRadius="md" />
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Delete photo"
                    position="absolute"
                    top="0"
                    right="0"
                    onClick={() => setServiceData({ ...serviceData, photos: serviceData.photos.filter((_, i) => i !== index) })}
                  />
                </Box>
              ))}
              <Button colorScheme="green">Add Photo</Button>
            </HStack>
            <Heading as="h3" size="md" mb={2}>Payment Methods</Heading>
            <HStack spacing={4}>
              <Text>Free</Text>
              <Switch isChecked={serviceData.paymentMethods.free} onChange={(e) => setServiceData({ ...serviceData, paymentMethods: { ...serviceData.paymentMethods, free: e.target.checked } })} />
              <Text>Favor Back</Text>
              <Switch isChecked={serviceData.paymentMethods.favorBack} onChange={(e) => setServiceData({ ...serviceData, paymentMethods: { ...serviceData.paymentMethods, favorBack: e.target.checked } })} />
              <Text>Swish</Text>
              <Switch isChecked={serviceData.paymentMethods.swish} onChange={(e) => setServiceData({ ...serviceData, paymentMethods: { ...serviceData.paymentMethods, swish: e.target.checked } })} />
            </HStack>
            <Button colorScheme="blue" onClick={handleServiceUpdate}>Update Service</Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Profile;