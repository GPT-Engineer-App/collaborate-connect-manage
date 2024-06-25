import { useState, useEffect } from "react";
import { Container, VStack, Heading, Input, Select, Button, Checkbox, Box, Text } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const Settings = () => {
  const { session } = useSupabaseAuth();
  const [profile, setProfile] = useState({ username: "", email: "", bio: "" });
  const [notifications, setNotifications] = useState({ email: false, sms: false });
  const [privacy, setPrivacy] = useState({ profileVisibility: "public" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchNotificationPreferences();
      fetchPrivacySettings();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, email, bio")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("email, sms")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setNotifications(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivacySettings = async () => {
    try {
      const { data, error } = await supabase
        .from("privacy_settings")
        .select("profile_visibility")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setPrivacy(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("user_id", session.user.id);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      const { error } = await supabase
        .from("notification_preferences")
        .update(notifications)
        .eq("user_id", session.user.id);

      if (error) throw error;
      alert("Notification preferences updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePrivacyUpdate = async () => {
    try {
      const { error } = await supabase
        .from("privacy_settings")
        .update(privacy)
        .eq("user_id", session.user.id);

      if (error) throw error;
      alert("Privacy settings updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  if (!session) {
    return <Text>You need to be logged in to view your settings.</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={{ base: 2, md: 4 }} width="100%">
        <Heading as="h1" size="xl">Account Settings</Heading>

        <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
          <Heading as="h2" size="lg" mb={4}>Profile Information</Heading>
          <Input
            placeholder="Username"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Input
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <Button colorScheme="blue" onClick={handleProfileUpdate}>Update Profile</Button>
        </Box>

        <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
          <Heading as="h2" size="lg" mb={4}>Notification Preferences</Heading>
          <Checkbox
            isChecked={notifications.email}
            onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
          >
            Email Notifications
          </Checkbox>
          <Checkbox
            isChecked={notifications.sms}
            onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
          >
            SMS Notifications
          </Checkbox>
          <Button colorScheme="blue" onClick={handleNotificationUpdate}>Update Notifications</Button>
        </Box>

        <Box width="100%" borderWidth="1px" borderRadius="lg" p={5}>
          <Heading as="h2" size="lg" mb={4}>Privacy Settings</Heading>
          <Select
            value={privacy.profileVisibility}
            onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
          <Button colorScheme="blue" onClick={handlePrivacyUpdate}>Update Privacy</Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default Settings;