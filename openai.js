const OpenAI = require("openai");
require("dotenv").config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const autoComplete = async (history, output_user) => {
  try {
    // Format the chat history for OpenAI's chat completion format
    const messages = [
      {
        role: "system",
        content: `You are an AI embedded in an AI-powered chat app. I will pass you a context of the latest messages of the chat labeled by who said it, and you will give me options on how to appropriately respond in the next message. Provide 3 options, each option delimited by a line break character so that I can parse the options easily.

Be sure that the output is in the format of a bulleted list, and that the output is a string with the options delimited by a line break character. There should not be backticks in the output, and the output should not be wrapped in a code block.

Example format:
* I'll check with them and let you know
* Hmm I think i'll pass for tonight
* Alright let's go! I love holland village`
      },
      {
        role: "user",
        content: `Here's the chat context:

${history.map((h) => `${h.user}: ${h.text}`).join("\n")}
${output_user}:

Please provide 3 appropriate response options in the bulleted format specified.`
      }
    ];

    // Call OpenAI API with GPT-4o mini model
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 0.95,
    });

    // Format response to match the expected structure from Vertex AI
    const content = response.choices[0].message.content;
    
    // Return in the same format as Vertex AI to maintain compatibility
    return {
      predictions: [
        {
          content: content
        }
      ]
    };

  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
};

module.exports = {
  autoComplete,
};
