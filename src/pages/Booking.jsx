import { useState } from "react";
import { Container, VStack, Heading, Input, Select, Button, Textarea, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const handleBooking = () => {
    // Handle booking logic here
    console.log({ date, time, location, message, paymentMethod });
    navigate("/confirmation");
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Heading as="h1" size="xl">Book a Service</Heading>
        <Input
          placeholder="Select date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          placeholder="Select time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <Input
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Select
          placeholder="Select payment method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bankTransfer">Bank Transfer</option>
        </Select>
        <Button colorScheme="blue" onClick={handleBooking}>Book Now</Button>
      </VStack>
    </Container>
  );
};

export default Booking;