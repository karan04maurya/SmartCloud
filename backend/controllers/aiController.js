const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.askAI = async (req, res) => {
    try {
        const { prompt, history = [] } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        // Mock mode if key is missing
        if (!apiKey || apiKey === 'mock_key') {
            console.log('Using Mock AI Mode (Invalid/Missing API Key)');
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return res.json({ 
                response: "🤖 **[Mock AI Mode]**\n\nI see you are testing the AI Assistant without a valid Google Gemini API Key! \n\nNormally, I would process your prompt: *\"" + prompt + "\"* and give you a real answer. To unlock my full brain, please get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey) and put it in your `.env` file!" 
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.8-flash",
            systemInstruction: "You are a helpful, concise AI assistant for SmartCloud, a student resource management app. Please keep answers relatively short and use plain text (avoid heavy markdown as the frontend currently renders plain text)."
        });

        // Initialize chat with history
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(prompt);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (err) {
        console.error('AI Error:', err.message);
        res.status(500).json({ error: 'Failed to generate AI response. Make sure your API key is valid.' });
    }
};
