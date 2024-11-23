

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint for text-to-speech
app.post('/api/text-to-speech', async (req, res) => {
    const { text, voice = 'en_us_male', outputFileName = 'output_audio.mp3' } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required for TTS conversion.' });
    }

    const getVoicesOptions = {
        method: 'GET',
        url: 'https://express-voic-text-to-speech.p.rapidapi.com/getAllVoice',
        headers: {
            'x-rapidapi-key': 'a0a8d5febcmshe47b7f142a0e75bp1d357bjsn860eb14b9175',
            'x-rapidapi-host': 'express-voic-text-to-speech.p.rapidapi.com',
        },
    };

    // try {
    //     // Fetch voices and verify the selected voice
    //     const voicesResponse = await axios.request(getVoicesOptions);
    //     const availableVoices = voicesResponse.data || [];
    //     const isValidVoice = availableVoices.some((v) => v.voice_id === voice);

    //     if (!isValidVoice) {
    //         return res.status(400).json({ error: `Invalid voice selected. Available voices: ${availableVoices.map((v) => v.voice_id).join(', ')}` });
    //     }

    //     // Prepare the TTS request
    //     const ttsOptions = {
    //         method: 'POST',
    //         url: 'https://express-voic-text-to-speech.p.rapidapi.com/textToSpeech',
    //         headers: {
    //             'x-rapidapi-key': 'a0a8d5febcmshe47b7f142a0e75bp1d357bjsn860eb14b9175',
    //             'x-rapidapi-host': 'express-voic-text-to-speech.p.rapidapi.com',
    //             'Content-Type': 'application/json',
    //         },
    //         data: {
    //             text,
    //             voice,
    //         },
    //         responseType: 'arraybuffer', // Handle binary data
    //     };

    //     // Send the TTS request
    //     const ttsResponse = await axios.request(ttsOptions);

    //     // Save the audio file
    //     const filePath = `./${outputFileName}`;
    //     fs.writeFileSync(filePath, ttsResponse.data);

    //     // Respond with success and file path
    //     res.status(200).json({ message: `Audio file saved as ${outputFileName}`, filePath });
    // } catch (error) {
    //     console.error('Error during TTS:', error.message);
    //     res.status(500).json({ error: 'Failed to process TTS request.', details: error.message });
    // }
    try {
        const voicesResponse = await axios.request(getVoicesOptions);
        console.log('Voices Response Data:', voicesResponse.data);
    
        // Ensure data is in the expected format
        const availableVoices = Array.isArray(voicesResponse.data) 
            ? voicesResponse.data 
            : (voicesResponse.data.voices || []);
    
        console.log('Available Voices Array:', availableVoices);
    
        // Validate the selected voice
        const isValidVoice = availableVoices.some((v) => v.voice_id === voice);
    
        if (!isValidVoice) {
            return res.status(400).json({
                error: `Invalid voice selected. Available voices: ${availableVoices.map((v) => v.voice_id).join(', ')}`,
            });
        }
    
        // Prepare the TTS request
        const ttsOptions = {
            method: 'POST',
            url: 'https://express-voic-text-to-speech.p.rapidapi.com/textToSpeech',
            headers: {
                'x-rapidapi-key': 'a0a8d5febcmshe47b7f142a0e75bp1d357bjsn860eb14b9175',
                'x-rapidapi-host': 'express-voic-text-to-speech.p.rapidapi.com',
                'Content-Type': 'application/json',
            },
            data: {
                text,
                voice,
            },
            responseType: 'arraybuffer',
        };
    
        const ttsResponse = await axios.request(ttsOptions);
        const filePath = `./${outputFileName}`;
        fs.writeFileSync(filePath, ttsResponse.data);
    
        res.status(200).json({ message: `Audio file saved as ${outputFileName}`, filePath });
    } catch (error) {
        console.error('Error during TTS:', error.message);
        res.status(500).json({ error: 'Failed to process TTS request.', details: error.message });
    }
    
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
