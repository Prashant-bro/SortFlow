import type { Email } from "@/types/email"

// This would typically be an API call to an AI service like OpenAI
// For demo purposes, we're simulating the API call
export async function generateSmartReply(email: Email): Promise<string> {
  // In a real implementation, you would call your AI API here
  // Example with OpenAI (commented out):
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that generates professional email replies. Adapt your tone to match the context of the original email.'
        },
        {
          role: 'user',
          content: `Please generate a professional reply to this email:
            Subject: ${email.subject}
            From: ${email.from}
            Message: ${email.message}
            
            The reply should be concise, professional, and address the key points in the original email.`
        }
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
  */

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate different responses based on email mood
  const responses = {
    Urgent: `I've received your urgent message regarding "${email.subject}". I understand the time-sensitive nature of this matter and will prioritize it immediately. I'll address the specific points you've raised about the project progress and priorities.

Let's schedule a call today to discuss this further. I'm available between 2-4pm, or please suggest a time that works for you.

Best regards,`,

    Early: `Thank you for your message about "${email.subject}". I appreciate you sharing this information early, which gives us ample time to prepare.

I've reviewed the details you've provided and will incorporate them into our planning. This proactive approach will definitely help us stay ahead of schedule.

Would you like to discuss this further in our next team meeting?

Kind regards,`,

    Late: `Thank you for your message regarding "${email.subject}". I understand there may be some urgency given the timing.

I'll review the details you've shared and respond with a comprehensive plan of action shortly. In the meantime, please let me know if there's anything specific you need immediate assistance with.

I appreciate your patience.

Best regards,`,

    Neutral: `Thank you for your message about "${email.subject}". I've reviewed the information you've shared and appreciate you keeping me in the loop.

I'll take the appropriate action based on your message and will follow up if I have any questions or updates to share.

Please let me know if you need anything else from my end.

Kind regards,`,
  }

  return responses[email.mood] || responses.Neutral
}
