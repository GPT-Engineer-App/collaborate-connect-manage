import { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Select, SimpleGrid, Box, Heading, Image, Button, HStack, IconButton } from "@chakra-ui/react";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";
import Map from '../components/Map';
import { FaHome, FaStar, FaEnvelope, FaUser, FaCog } from 'react-icons/fa';

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
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [radius, setRadius] = useState(1000);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", category: "", priority: "", due_date: "" });
  const [providers, setProviders] = useState([]);

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

  const fetchProvidersWithinRadius = async (center, radius) => {
    const { data, error } = await supabase
      .rpc('get_providers_within_radius', { center_lat: center[0], center_lng: center[1], radius });

    if (error) {
      console.error("Error fetching providers:", error);
    } else {
      setProviders(data);
    }
  };

  useEffect(() => {
    fetchProvidersWithinRadius(mapCenter, radius);
    fetchTasks();
  }, [mapCenter, radius]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
  };

  const handleCreateTask = async () => {
    const { error } = await supabase
      .from("tasks")
      .insert([{ ...newTask, user_id: session.user.id }]);

    if (error) {
      console.error("Error creating task:", error);
    } else {
      fetchTasks();
      setNewTask({ title: "", description: "", category: "", priority: "", due_date: "" });
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    const { error } = await supabase
      .from("tasks")
      .update(updatedTask)
      .eq("task_id", taskId);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      fetchTasks();
    }
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
        <Map onRadiusChange={setRadius} onCenterChange={setMapCenter} />
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} width="100%">
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
        <Heading as="h2" size="lg">Your Tasks</Heading>
        <VStack spacing={4} width="100%">
          {tasks.map(task => (
            <Box key={task.task_id} borderWidth="1px" borderRadius="lg" p={4} width="100%">
              <Heading as="h3" size="md">{task.title}</Heading>
              <Text>{task.description}</Text>
              <Text>Category: {task.category}</Text>
              <Text>Priority: {task.priority}</Text>
              <Text>Due Date: {task.due_date}</Text>
              <Button colorScheme="blue" onClick={() => handleEditTask(task.task_id, { ...task, title: "Updated Title" })}>Edit</Button>
              <Button colorScheme="red" onClick={() => handleDeleteTask(task.task_id)}>Delete</Button>
            </Box>
          ))}
        </VStack>
        <Heading as="h2" size="lg">Create New Task</Heading>
        <VStack spacing={4} width="100%">
          <Input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <Select
            placeholder="Category"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          <Input
            placeholder="Priority"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          />
          <Input
            placeholder="Due Date"
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          />
          <Button colorScheme="blue" onClick={handleCreateTask}>Create Task</Button>
        </VStack>
      </VStack>
      <HStack
        spacing={{ base: 2, md: 4 }}
        position="fixed"
        bottom={0}
        width="100%"
        bg="white"
        p={{ base: 2, md: 4 }}
        justifyContent="space-around"
        boxShadow="md"
      >
        <IconButton icon={<FaHome />} aria-label="Home" />
        <IconButton icon={<FaStar />} aria-label="Favorites" />
        <IconButton icon={<FaEnvelope />} aria-label="Messages" />
        <IconButton icon={<FaUser />} aria-label="Profile" />
        <IconButton icon={<FaCog />} aria-label="Settings" />
      </HStack>
    </Container>
  );
};

export default Index;