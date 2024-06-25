import { useState, useEffect } from 'react';
import { Container, VStack, Heading, Input, Button, Text, List, ListItem } from '@chakra-ui/react';
import { uploadPngFiles } from '../utils/uploadPngFiles.js';
import { supabase } from '../integrations/supabase/index.js';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [availableFiles, setAvailableFiles] = useState([]);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('https://vmbsgflfyqxvqzofheja.supabase.co/storage/v1/bucket/upload-png', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*', // Added CORS header
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setSuccess('Files uploaded successfully!');
            fetchAvailableFiles(); // Fetch the updated list of available files
        } catch (error) {
            setError('Error uploading files.');
        } finally {
            setUploading(false);
        }
    };

    const fetchAvailableFiles = async () => {
        try {
            const { data, error } = await supabase.storage.from('files_bucket').list('public', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

            if (error) {
                console.error('Error fetching files:', error);
                throw error;
            }

            setAvailableFiles(data);
        } catch (error) {
            setError('Error fetching available files.');
        }
    };

    useEffect(() => {
        fetchAvailableFiles();
    }, []);

    return (
        <Container centerContent maxW="container.md" py={10}>
            <VStack spacing={4} width="100%">
                <Heading as="h1" size="xl">Files</Heading>
                <Input type="file" multiple onChange={handleFileChange} />
                <Button colorScheme="blue" onClick={handleUpload} isLoading={uploading}>Upload</Button>
                {error && <Text color="red.500">{error}</Text>}
                {success && <Text color="green.500">{success}</Text>}
                <Heading as="h2" size="lg" mt={10}>Available Files</Heading>
                <List spacing={3} width="100%">
                    {availableFiles.map((file, index) => (
                        <ListItem key={index}>{file.name}</ListItem>
                    ))}
                </List>
            </VStack>
        </Container>
    );
};

export default Files;