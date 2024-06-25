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

  const handleBooking = async () => {
    try {
      const response = await fetch('https://example.com/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Added CORS header
        },
        body: JSON.stringify({
          date,
          time,
          location,
          message,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      navigate("/confirmation");
    } catch (error) {
      console.error("Error handling booking:", error);
    }
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={{ base: 2, md: 4 }} width="100%">
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