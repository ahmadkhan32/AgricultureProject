// ChatGPT Service for AI content generation
class ChatGPTService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || null;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.demoMode = !this.apiKey; // Use demo mode if no API key
  }

  // Generate content using ChatGPT API or demo mode
  async generateContent(prompt, type = 'service') {
    if (this.demoMode) {
      return this.generateDemoContent(prompt, type);
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
              content: this.getSystemPrompt(type)
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
      return this.parseAIResponse(data.choices[0].message.content, type);
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      return this.generateDemoContent(prompt, type);
    }
  }

  // Get system prompt based on content type
  getSystemPrompt(type) {
    if (type === 'service') {
      return `You are an expert content writer for an agricultural organization in Comoros. 
      Generate a service description in French with the following structure:
      - Title: A compelling service title
      - Description: Brief service description (2-3 sentences)
      - Blog Content: Detailed article about the service (3-4 paragraphs)
      - Tags: Relevant tags for the service
      - Category: Service category
      
      Format your response as JSON with these exact keys: title, description, blogContent, tags, category`;
    } else {
      return `You are an expert content writer for an agricultural organization in Comoros.
      Generate a producer profile in French with the following structure:
      - Name: Producer name
      - Location: Island/region in Comoros
      - Category: Agriculture, Livestock, or Fishing
      - Products: List of products (3-5 items)
      - Description: Brief producer description
      - Blog Content: Detailed article about the producer (3-4 paragraphs)
      - Tags: Relevant tags
      
      Format your response as JSON with these exact keys: name, location, category, products, description, blogContent, tags`;
    }
  }

  // Parse AI response into structured data
  parseAIResponse(content, type) {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.generateDemoContent('', type);
    }
  }

  // Generate demo content when API is not available
  generateDemoContent(prompt, type) {
    const demoContent = {
      service: {
        title: "Formation en Agriculture Durable",
        description: "Programme complet de formation pour les agriculteurs comoriens sur les pratiques agricoles durables et respectueuses de l'environnement.",
        blogContent: `L'agriculture durable représente l'avenir de l'agriculture aux Comores. Ce programme de formation innovant vise à équiper les agriculteurs locaux avec les connaissances et compétences nécessaires pour adopter des pratiques respectueuses de l'environnement.

        Notre approche holistique couvre tous les aspects de l'agriculture durable, depuis la gestion des sols jusqu'aux techniques de conservation de l'eau. Les participants apprendront à utiliser des méthodes naturelles pour améliorer la fertilité des sols, réduire l'utilisation de pesticides chimiques et maximiser les rendements tout en préservant l'écosystème local.

        Le programme inclut des sessions pratiques sur le terrain, des ateliers interactifs et un suivi personnalisé pour chaque participant. Nous travaillons en étroite collaboration avec les communautés locales pour adapter nos formations aux conditions spécifiques de chaque île de l'archipel comorien.

        Cette initiative s'inscrit dans notre vision de développement durable et de sécurité alimentaire pour les Comores. En formant nos agriculteurs aux meilleures pratiques, nous contribuons à la résilience de nos communautés face aux défis climatiques et économiques.`,
        tags: ["agriculture", "formation", "durable", "environnement", "comores"],
        category: "Programmes de formation"
      },
      producer: {
        name: "Ahmed Mohamed",
        location: "Grande Comore",
        category: "Agriculture",
        products: ["Vanille", "Girofle", "Cacao", "Légumes", "Fruits tropicaux"],
        description: "Producteur expérimenté spécialisé dans la culture de vanille et d'épices de qualité supérieure.",
        blogContent: `Ahmed Mohamed est un producteur passionné qui a transformé sa ferme familiale en un modèle d'excellence agricole aux Comores. Depuis plus de 15 ans, il cultive la vanille, le girofle et d'autres épices précieuses qui font la renommée de l'archipel.

        Sa ferme de 5 hectares, située dans les hauteurs de Grande Comore, bénéficie d'un microclimat idéal pour la culture de la vanille. Ahmed a développé des techniques de culture traditionnelles améliorées qui respectent l'environnement tout en maximisant la qualité de ses produits.

        En plus de ses cultures principales, Ahmed diversifie sa production avec des légumes et fruits tropicaux pour assurer la sécurité alimentaire de sa famille et de sa communauté. Il partage volontiers ses connaissances avec d'autres producteurs locaux, contribuant ainsi au développement de l'agriculture dans sa région.

        Son engagement pour l'agriculture durable et sa passion pour l'innovation font d'Ahmed un exemple inspirant pour la nouvelle génération d'agriculteurs comoriens.`,
        tags: ["vanille", "girofle", "agriculture", "grande comore", "épices"]
      }
    };

    return demoContent[type] || demoContent.service;
  }

  // Generate image suggestions (demo)
  generateImageSuggestions(content) {
    const suggestions = [
      "agriculture-comores-1.jpg",
      "agriculture-comores-2.jpg", 
      "agriculture-comores-3.jpg",
      "farming-comores-1.jpg",
      "farming-comores-2.jpg"
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }
}

const chatgptService = new ChatGPTService();
export default chatgptService;
