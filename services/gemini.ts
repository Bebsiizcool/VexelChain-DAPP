import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, MarketSentiment, Token } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMarket = async (tokens: Token[], selectedToken: Token): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    // Return mock data if no key is present for demo purposes
    return {
      sentiment: MarketSentiment.BULLISH,
      summary: "API Key missing. Showing demo analysis. The market shows strong momentum with increased volume across major pairs.",
      keyLevels: {
        support: "$42,500",
        resistance: "$45,200"
      },
      recommendation: "Accumulate on dips."
    };
  }

  const prompt = `
    Analyze the following crypto market data for ${selectedToken.name} (${selectedToken.symbol}).
    Current Price: $${selectedToken.price}
    24h Change: ${selectedToken.change24h}%
    Volume: ${selectedToken.volume}
    Market Cap: ${selectedToken.marketCap}
    
    Context:
    Other tokens in the market: ${tokens.map(t => `${t.symbol}: ${t.change24h}%`).join(', ')}.

    Provide a professional financial trading analysis.
    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: ["BULLISH", "BEARISH", "NEUTRAL"],
              description: "Overall market sentiment"
            },
            summary: {
              type: Type.STRING,
              description: "A concise 2-3 sentence analysis of the price action."
            },
            keyLevels: {
              type: Type.OBJECT,
              properties: {
                support: { type: Type.STRING, description: "Key support price level" },
                resistance: { type: Type.STRING, description: "Key resistance price level" }
              }
            },
            recommendation: {
              type: Type.STRING,
              description: "Actionable advice (e.g., Buy, Sell, Hold)"
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    // Fallback in case of error
    return {
      sentiment: MarketSentiment.NEUTRAL,
      summary: "Unable to generate real-time analysis at this moment. Market volatility requires caution.",
      keyLevels: {
        support: "---",
        resistance: "---"
      },
      recommendation: "Hold and Observe"
    };
  }
};
