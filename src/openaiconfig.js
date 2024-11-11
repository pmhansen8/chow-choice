import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.REACT_APP_ai_apiKey,
    dangerouslyAllowBrowser: true,
});


const getChatCompletion = async () => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say this is a test" }],
            model: "gpt-4o-mini",
        });

        console.log(completion.data.choices[0].message.content);
        return completion.data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching completion:", error);
    }
};


getChatCompletion();
export default openai;