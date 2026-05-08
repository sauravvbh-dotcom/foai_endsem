export const getChatbotResponse = async (userMessage, contextData) => {
  const systemContent = `You are an AI assistant for the "SpacePulse Dashboard". 
IMPORTANT RESTRICTION: You MUST ONLY answer questions using the following provided context data about the ISS and Dashboard News.
NO external/general knowledge allowed. 
If the answer cannot be found in the provided context, respond EXACTLY with: "I can only answer questions related to ISS tracking and dashboard news."

CONTEXT DATA:
- ISS Speed: ${contextData.speed || 'Unknown'} km/h
- ISS Coordinates: Latitude ${contextData.lat || 'Unknown'}, Longitude ${contextData.lon || 'Unknown'}
- Nearest Location: ${contextData.location || 'Unknown'}
- Astronauts in Space: ${contextData.astronautCount || 0} (${(contextData.astronauts || []).map(a => a.name).join(', ')})
- Top News Headlines:
${(contextData.news || []).map((n, i) => `${i + 1}. ${n.title}`).join('\n')}`;

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AI_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "meta-llama/Llama-3.2-1B-Instruct",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.2
      }),
    });
    
    const result = await response.json();
    if (result.choices && result.choices.length > 0) {
      return result.choices[0].message.content.trim();
    } else {
      console.error("Unexpected AI response:", result);
      return "Sorry, I received an empty response from the AI model.";
    }
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I am currently unable to process your request. Please check API configuration or try again later.";
  }
};
