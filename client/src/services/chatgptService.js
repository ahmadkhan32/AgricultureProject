// ChatGPT Integration Service
class ChatGPTService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'demo-key';
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.isDemoMode = !process.env.REACT_APP_OPENAI_API_KEY;
  }

  // Generate content using ChatGPT API
  async generateContent(prompt, contentType = 'service') {
    if (this.isDemoMode) {
      return this.generateDemoContent(prompt, contentType);
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(contentType)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseResponse(data.choices[0].message.content, contentType);
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      // Fallback to demo content
      return this.generateDemoContent(prompt, contentType);
    }
  }

  // Generate demo content when API key is not available
  generateDemoContent(prompt, contentType) {
    const templates = {
      service: {
        title: `Service: ${prompt}`,
        description: `This service provides comprehensive support for ${prompt}. Our expert team offers specialized assistance to help you achieve your goals in this area.`,
        blogContent: `# ${prompt}\n\n## Overview\nThis comprehensive guide covers everything you need to know about ${prompt}.\n\n## Key Benefits\n- Professional expertise\n- Customized solutions\n- Ongoing support\n\n## Getting Started\nContact our team to learn more about how we can help you with ${prompt}.`,
        category: 'Agricultural Services',
        tags: ['agriculture', 'support', 'expertise']
      },
      producer: {
        title: `Producer Profile: ${prompt}`,
        description: `Meet our featured producer specializing in ${prompt}. With years of experience and dedication to quality, they represent the best of our agricultural community.`,
        blogContent: `# Producer Spotlight: ${prompt}\n\n## About This Producer\nThis dedicated producer has been working in ${prompt} for many years, bringing expertise and passion to their craft.\n\n## Products & Services\n- High-quality products\n- Sustainable practices\n- Community involvement\n\n## Contact Information\nLearn more about this producer and their offerings.`,
        category: 'Producer Profile',
        tags: ['producer', 'agriculture', 'community']
      }
    };

    return templates[contentType] || templates.service;
  }

  // Get system prompt based on content type
  getSystemPrompt(contentType) {
    const prompts = {
      service: `You are an expert content writer for an agricultural website. Generate professional service descriptions and blog content for agricultural services. Focus on practical benefits, expertise, and value for farmers and agricultural professionals.`,
      producer: `You are an expert content writer for an agricultural website. Generate engaging producer profiles and blog content that highlights individual farmers, their products, and their contributions to the agricultural community.`
    };

    return prompts[contentType] || prompts.service;
  }

  // Parse ChatGPT response into structured content
  parseResponse(response, contentType) {
    try {
      // Try to parse as JSON first
      if (response.startsWith('{')) {
        return JSON.parse(response);
      }

      // Parse structured text response
      const lines = response.split('\n').filter(line => line.trim());
      const content = {
        title: '',
        description: '',
        blogContent: response,
        category: contentType === 'service' ? 'Agricultural Services' : 'Producer Profile',
        tags: ['agriculture', 'farming']
      };

      // Extract title and description from structured response
      for (const line of lines) {
        if (line.startsWith('Title:') || line.startsWith('Titre:')) {
          content.title = line.replace(/^(Title|Titre):\s*/, '');
        } else if (line.startsWith('Description:') || line.startsWith('Description:')) {
          content.description = line.replace(/^(Description|Description):\s*/, '');
        }
      }

      // If no title found, generate one
      if (!content.title) {
        content.title = `${contentType === 'service' ? 'Service' : 'Producer'}: ${contentType}`;
      }

      return content;
    } catch (error) {
      console.error('Error parsing ChatGPT response:', error);
      return this.generateDemoContent('Error parsing response', contentType);
    }
  }

  // Generate image suggestions (placeholder for future image generation)
  async generateImageSuggestions(content) {
    // This would integrate with DALL-E or similar image generation API
    return {
      suggestions: [
        'Agricultural field with crops',
        'Farmer working in field',
        'Modern farming equipment',
        'Fresh produce display'
      ],
      recommended: 'Agricultural field with crops'
    };
  }

  // Validate API key
  async validateApiKey() {
    if (this.isDemoMode) {
      return { valid: false, mode: 'demo' };
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5
        })
      });

      return { valid: response.ok, mode: 'api' };
    } catch (error) {
      return { valid: false, mode: 'demo' };
    }
  }
}

// Create singleton instance
const chatgptService = new ChatGPTService();

export default chatgptService;
