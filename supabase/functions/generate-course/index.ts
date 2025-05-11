import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, description, proficiency, depth, chaptersCount, includeAssessments } = await req.json();
    
    // Create a prompt for Deepseek to generate a course
    const systemPrompt = `You are an expert educational content creator. Create a comprehensive, well-structured course on the requested topic.`;
    
    const userPrompt = `
      Create a detailed course on "${topic}". ${description ? `Additional focus areas: ${description}` : ''}
      
      Course Parameters:
      - Proficiency Level: ${proficiency} (beginner, intermediate, or advanced)
      - Learning Depth: ${depth}% (higher percentage means more comprehensive coverage)
      - Number of Chapters: ${chaptersCount}
      - Include Assessments: ${includeAssessments ? 'Yes' : 'No'}
      
      For each chapter, provide:
      1. A clear title and learning objectives
      2. Detailed content with examples and explanations
      3. Summary of key points
      4. 2-3 external resources including relevant YouTube videos and articles/websites
      ${includeAssessments ? '5. Assessment questions with answers to test understanding' : ''}
      
      Format the response as a JSON object with the following structure:
      {
        "courseTitle": "string",
        "courseDescription": "string",
        "proficiencyLevel": "string",
        "chapters": [
          {
            "title": "string",
            "objectives": ["string"],
            "content": "string",
            "summary": "string",
            "resources": [
              {
                "type": "video|article",
                "title": "string",
                "url": "string",
                "description": "string"
              }
            ],
            "assessment": [
              {
                "question": "string",
                "options": ["string"],
                "correctAnswer": "number",
                "explanation": "string"
              }
            ]
          }
        ]
      }
    `;

    console.log("Sending request to Deepseek API");
    
    // Get API key from environment variable
    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      throw new Error("Deepseek API key not found");
    }

    // Call the Deepseek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Deepseek API error:", errorData);
      throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from Deepseek API");

    // Parse the AI response to extract the course content
    let courseData;
    try {
      // The content is in the first message from the assistant
      const content = data.choices[0].message.content;
      
      // Try to parse JSON from the response
      // First, attempt to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        courseData = JSON.parse(jsonMatch[1]);
      } else {
        // Otherwise, try to parse the whole response as JSON
        courseData = JSON.parse(content);
      }
      
      // If parsing fails or we don't get the expected structure, throw an error
      if (!courseData || !courseData.chapters) {
        throw new Error("Failed to parse course data from response");
      }
    } catch (error) {
      console.error("Error parsing course data:", error);
      // If parsing fails, return the raw content for further processing on the client
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to parse course structure. Please try again.", 
          rawResponse: data 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the generated course data
    return new Response(
      JSON.stringify({ 
        success: true,
        course: courseData 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while generating the course"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
