export const getChatbotResponse = async (userMessage, contextData) => {
  const systemContent = `You are the "SpacePulse AI Assistant", a highly specialized expert in ISS telemetry and global space news.
  
Your goal is to provide accurate, concise, and helpful answers based ON THE LIVE DATA provided below. 

GUIDELINES:
- Use the CONTEXT DATA below as your ground truth.
- If the user asks something NOT related to the dashboard data or space, politely guide them back to ISS and news topics.
- Be professional, conversational, and "space-themed".
- If data is missing (Unknown), mention that you're waiting for the live feed to update.

CONTEXT DATA:
- ISS Real-time Speed: ${contextData.speed || '27,600'} km/h (current estimate)
- ISS Coordinates: Latitude ${contextData.lat || 'Unknown'}, Longitude ${contextData.lon || 'Unknown'}
- Current Ground Track: Over ${contextData.location || 'the Ocean'}
- Personnel in Orbit: ${contextData.astronautCount || 0}
- Active News Feed:
${(contextData.news || []).slice(0, 5).map((n, i) => `  * ${n.title}`).join('\n')}`;

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AI_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userMessage }
        ],
        max_tokens: 250,
        temperature: 0.5
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
