import axios from 'axios';

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateContent(prompt: string) {
  console.log('Generating content with Gemini...', API_KEY);
  if (!API_KEY) {
    throw new Error('Google API Key is not defined');
  }

  const requestBody: GeminiRequest = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  try {
    const response = await axios.post<GeminiResponse>(
      `${API_BASE_URL}/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract and return the generated text
    return response.data.candidates[0]?.content.parts[0]?.text || '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Gemini API Error:', error.response?.data);
      throw new Error(error.response?.data?.error?.message || 'Failed to generate content');
    }
    throw error;
  }
}

// Example usage functions
export async function optimizeContent(content: string) {
  const prompt = `  
  You are an AI content optimizer. Optimize the following content for SEO and readability.  
  Return ONLY the optimized content without any additional commentary or suggestions.  
  
  Content: ${content}  
  
  Rules for optimization:  
  - Maintain the original meaning and intent  
  - Improve readability and flow  
  - Optimize for SEO naturally  
  - Keep the tone professional  
  - Format with proper paragraphs  
  - Include the optimized title at the top  
  `;

  return generateContent(prompt);
}

export async function testGeminiConnection() {
  try {
    const response = await generateContent('Hello, testing API connection');
    return {
      success: true,
      message: 'API connection successful',
      response
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      message: 'API connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}