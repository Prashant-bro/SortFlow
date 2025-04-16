import openai

openai.api_key = 'your-api-key'

response = openai.Completion.create(
  model="text-davinci-003",
  prompt="Classify this message into categories: 'urgent', 'social', 'work': 'Meeting at 3 PM.'",
  max_tokens=10
)
print(response.choices[0].text.strip())
