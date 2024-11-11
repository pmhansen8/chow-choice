import openai from '../openaiconfig'; 

const generateEatOut = async (items,location) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Give me 5 places to eat given these items ${items} and this location ${location}` }],
            model: "gpt-4o-mini",
            max_tokens: 10000,
        });

       
        console.log("API Response:", completion);

      
        if (completion.choices && completion.choices.length > 0) {
            const meta = completion.choices[0].message.content;
            return meta;
        } else {
            console.error("No choices returned in the response");
            return null; 
        }
    } catch (error) {
        console.error("Error in generateMeta:", error);
        return null; 
    }
};

export { generateEatOut };

const generateEatIn = async (items) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: `Come up with five recipes with these items ${items}` }],
            model: "gpt-4o-mini",
            max_tokens: 10000,
        });

       
        console.log("API Response:", completion);

      
        if (completion.choices && completion.choices.length > 0) {
            const meta = completion.choices[0].message.content;
            return meta;
        } else {
            console.error("No choices returned in the response");
            return null; 
        }
    } catch (error) {
        console.error("Error in generateMeta:", error);
        return null; 
    }
};

export { generateEatIn };


