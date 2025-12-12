import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interface for a chat message to ensure type safety.
 */
interface ChatMessage {
    type: 'user' | 'bot';
    text: string;
}

@Component({
    selector: 'app-nutritionist-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './nutrition.html',
    styleUrls: ['./nutrition.css']
})
export class NutritionComponent implements OnInit, AfterViewChecked {
    @ViewChild('messageContainer') private messageContainer!: ElementRef;

    messages: ChatMessage[] = [
        {
            type: 'bot',
            text: `Hello! I'm Dr. Amina, your AI Nutritionist specializing in African superfoods and traditional nutrition wisdom. 

I can help you with:
• Personalized nutrition advice
• African superfood benefits
• Meal planning & recipes
• Dietary requirements
• Health goals & tracking

What would you like to know about nutrition today?`
        }
    ];

    userInput = '';
    isBotTyping = false;

    readonly quickQuestions = [
        {
            emoji: '🥗',
            question: 'What are the health benefits of moringa?'
        },
        {
            emoji: '🌾',
            question: 'How can I incorporate teff into my diet?'
        },
        {
            emoji: '💪',
            question: 'Best African foods for muscle building?'
        },
        {
            emoji: '🧠',
            question: 'African superfoods for brain health?'
        },
        {
            emoji: '❤️',
            question: 'Heart-healthy African foods?'
        },
        {
            emoji: '🌿',
            question: 'Traditional African herbal remedies?'
        }
    ];

    readonly nutritionTips = [
        'Drink plenty of water with baobab for maximum vitamin C absorption',
        'Combine beans and grains for complete protein (like rice and beans)',
        'Fermented foods like injera support gut health',
        'Dark leafy greens are rich in iron and calcium'
    ];

    readonly africanSuperfoods = [
        { emoji: '🌿', name: 'Moringa', benefit: '7x Vitamin C' },
        { emoji: '🌳', name: 'Baobab', benefit: '6x Vitamin C' },
        { emoji: '🌾', name: 'Teff', benefit: 'Iron-rich' },
        { emoji: '🌱', name: 'Fonio', benefit: 'Gluten-free' }
    ];

    private readonly responses: Record<string, string> = {
        'moringa': `Moringa is often called the "Miracle Tree" for good reason! 🌿

**Key Benefits:**
• 7x more Vitamin C than oranges
• 4x more Vitamin A than carrots
• Rich in iron, calcium, and potassium
• Powerful anti-inflammatory properties
• Supports immune system function

**How to use:**
Add moringa powder to smoothies, soups, or sprinkle over salads. Start with 1 teaspoon daily.`,

        'teff': `Teff is an ancient Ethiopian grain that's a nutritional powerhouse! 🌾

**Nutritional Profile:**
• Complete protein with all essential amino acids
• High in iron and calcium
• Rich in resistant starch (great for gut health)
• Gluten-free and easy to digest

**Ways to enjoy:**
• Traditional injera bread
• Teff porridge for breakfast
• Use in baking instead of wheat flour
• Add to soups as a thickener`,

        'muscle': `African foods are excellent for muscle building! 💪

**Top Choices:**
• **Beans & Legumes**: Rich in plant-based protein
• **Teff & Fonio**: Complete proteins with essential amino acids
• **Moringa**: High protein content with all essential amino acids
• **Baobab**: Rich in Vitamin C for collagen production
• **Plantains**: Complex carbs for energy

**Sample Meal:**
Bean stew with teff injera and moringa smoothie!`,

        'brain': `Boost your brain power with these African superfoods! 🧠

**Cognitive Enhancers:**
• **Baobab**: High in antioxidants that protect brain cells
• **Moringa**: Rich in vitamins that support neurotransmitter function
• **Tigernuts**: Good source of healthy fats for brain health
• **Bitter Leaf**: Traditional brain tonic
• **Roselle (Hibiscus)**: Improves blood flow to the brain`,

        'heart': `Protect your heart with traditional African foods! ❤️

**Heart-Healthy Choices:**
• **Okra**: Rich in soluble fiber that lowers cholesterol
• **Bitter Leaf**: Helps regulate blood pressure
• **Garlic & Onions**: Natural blood thinners
• **Whole Grains**: Teff and fonio are excellent choices
• **Leafy Greens**: Spinach, amaranth for magnesium`,

        'herbal': `Traditional African herbal wisdom is profound! 🌿

**Common Remedies:**
• **Moringa Leaves**: For energy and vitality
• **Bitter Leaf**: For digestion and blood sugar
• **Neem**: For skin health and immunity
• **Scent Leaf**: For respiratory health
• **Aloe Vera**: For digestive healing

**Remember**: Always consult healthcare providers before using herbal remedies.`,

        'default': `That's an excellent nutrition question! 

As your AI Nutritionist specializing in African superfoods, I can help you with:
• Specific African food benefits
• Meal planning with traditional ingredients
• Nutritional requirements for different goals
• Combining foods for maximum nutrition
• Traditional preparation methods

Try asking about moringa, teff, baobab, or specific health goals!`
    };

    ngOnInit(): void {
        // Initialization logic if needed
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    sendMessage(): void {
        const text = this.userInput.trim();
        if (!text || this.isBotTyping) return;

        this.messages.push({ type: 'user', text });
        this.userInput = '';
        this.isBotTyping = true;

        setTimeout(() => {
            const botResponse = this.getBotResponse(text.toLowerCase());
            this.messages.push({ type: 'bot', text: botResponse });
            this.isBotTyping = false;
        }, 1000 + Math.random() * 1000); // Simulate thinking time
    }

    askQuestion(question: string): void {
        if (this.isBotTyping) return;
        this.userInput = question;
        this.sendMessage();
    }

    private getBotResponse(input: string): string {
        // Check for keywords in the input
        const keywords = Object.keys(this.responses);
        for (const key of keywords) {
            if (input.includes(key) && key !== 'default') {
                return this.responses[key];
            }
        }
        return this.responses['default'];
    }

    private scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {
            // Handle error if element is not yet available
        }
    }

    trackByMessage(index: number, msg: ChatMessage): string {
        return `${index}-${msg.type}-${msg.text.length}`;
    }
}
