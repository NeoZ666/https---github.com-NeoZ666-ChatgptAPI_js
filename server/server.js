import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,  // Note how the .env file is outaisw the server folder.
});

const openai = new OpenAIApi(configuration);

// Setting up Express Application
const app = express();
app.use(cors());
app.use(express.json());

// Dummy Route: Respond with "Hello from Codex" when a GET request is made to the homepage
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
})

// app.post can handle, send larger payloads than GET, however the latter is more efficient.
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.2,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            // stop: ["\"\"\""],
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
})


app.listen(5000, () => console.log('AI server started on http://localhost:5000'));