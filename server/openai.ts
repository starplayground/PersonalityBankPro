import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PersonalityInsights {
  scores: PersonalityScores;
  insights: string;
  strengths: string[];
  growthAreas: string[];
}

export interface RecommendationData {
  category: "career" | "relationships" | "habits";
  title: string;
  description: string;
  action: string;
}

export async function analyzePersonality(responses: { questionText: string; answer: string; trait: string }[]): Promise<PersonalityInsights> {
  try {
    const prompt = `
    Analyze the following personality assessment responses and provide a comprehensive personality analysis based on the Big Five personality traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).

    Assessment Responses:
    ${responses.map(r => `Question: ${r.questionText}\nAnswer: ${r.answer}\nTrait: ${r.trait}`).join('\n\n')}

    Please provide a JSON response with:
    1. Scores for each Big Five trait (0-100 scale)
    2. A comprehensive personality insights paragraph (2-3 sentences)
    3. Top 3 strengths based on the personality profile
    4. Top 3 growth areas for development

    Response format:
    {
      "scores": {
        "openness": number,
        "conscientiousness": number,
        "extraversion": number,
        "agreeableness": number,
        "neuroticism": number
      },
      "insights": "string",
      "strengths": ["string", "string", "string"],
      "growthAreas": ["string", "string", "string"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional personality psychologist specializing in Big Five personality assessment analysis. Provide accurate, insightful, and constructive personality analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as PersonalityInsights;
  } catch (error) {
    console.error("Error analyzing personality:", error);
    throw new Error("Failed to analyze personality profile");
  }
}

export async function generateRecommendations(personalityProfile: PersonalityInsights): Promise<RecommendationData[]> {
  try {
    const prompt = `
    Based on the following personality profile, generate 3 personalized recommendations (one for each category: career, relationships, habits) that would help this person grow and develop.

    Personality Profile:
    - Openness: ${personalityProfile.scores.openness}%
    - Conscientiousness: ${personalityProfile.scores.conscientiousness}%
    - Extraversion: ${personalityProfile.scores.extraversion}%
    - Agreeableness: ${personalityProfile.scores.agreeableness}%
    - Neuroticism: ${personalityProfile.scores.neuroticism}%
    
    Insights: ${personalityProfile.insights}
    Strengths: ${personalityProfile.strengths.join(", ")}
    Growth Areas: ${personalityProfile.growthAreas.join(", ")}

    Please provide 3 actionable recommendations in JSON format:
    {
      "recommendations": [
        {
          "category": "career",
          "title": "string",
          "description": "string (2-3 sentences)",
          "action": "string (specific action they can take)"
        },
        {
          "category": "relationships", 
          "title": "string",
          "description": "string (2-3 sentences)",
          "action": "string (specific action they can take)"
        },
        {
          "category": "habits",
          "title": "string", 
          "description": "string (2-3 sentences)",
          "action": "string (specific action they can take)"
        }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional development coach and psychologist. Provide practical, actionable recommendations based on personality profiles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations as RecommendationData[];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
}
