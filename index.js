import express from 'express';
import cors from 'cors';
import http from 'https'
import dbConnect from './config/dbConnect.js';
import dotenv from "dotenv";
import { deleteData, getUserData, UserRecord } from './controller/UserRecord.js';
dotenv.config();
dbConnect();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/text-to-speech', async (req, res) => {
    const { text, voice = process.env.VOICE_URL } = req.body;
  
   
    if (!text) {
        return res.status(400).json({ error: 'Text is required for TTS conversion.' });
    }

    try {
        const options = {
            method: 'POST',
            hostname: 'api.play.ht',
            path: '/api/v2/tts/stream',
            headers: {
                accept: 'audio/mpeg',
                'content-type': 'application/json',
                AUTHORIZATION: process.env.AUTHORIZATION_URL,
                'X-USER-ID': 'mqhkhcnXtqSzwvPgETY1TjTt8q82',
            },

        
        };

        const externalReq = http.request(options, (externalRes) => {
            if (externalRes.statusCode !== 200) {
                return res.status(externalRes.statusCode).json({
                    error: `Play.ht API error: ${externalRes.statusMessage}`,
                });
            }

            // Set response headers for the client
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', 'inline; filename=output_audio.mp3');

            // Pipe the audio data directly to the client
            externalRes.pipe(res);
        });

        externalReq.on('error', (err) => {
            console.error('Error during API request:', err.message);
            res.status(500).json({ error: 'Failed to fetch audio from Play.ht.' });
        });

        // Send request body to Play.ht API
        externalReq.write(JSON.stringify({ voice,voice_engine: 'PlayHT2.0-turbo',output_format: 'mp3', text }));
        externalReq.end();
    } catch (error) {
        console.error('Error during TTS process:', error.message);
        res.status(500).json({ error: 'Failed to process TTS request.', details: error.message });
    }
});


app.post('/api/savedaudio',UserRecord);

app.get('/api/data',getUserData)

app.delete('/api/delete',deleteData)

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
