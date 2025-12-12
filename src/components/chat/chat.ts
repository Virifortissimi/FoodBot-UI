import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Interface for a chat message to ensure type safety.
 */
interface ChatMessage {
    type: 'user' | 'bot';
    text: string;
    time: Date;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.html',
    styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit {
    @ViewChild('messageContainer') private messageContainer!: ElementRef;

    messages: ChatMessage[] = [
        { type: 'bot', text: 'Hello! I\'m FoodBot. Ask me anything about African cuisine, recipes, or ingredients!', time: new Date() }
    ];

    userInput = '';
    isBotTyping = false;

    readonly quickQuestions: string[] = [
        'What is jollof rice?',
        'How to make injera?',
        'Best African spices?',
        'Tell me about West African street food.'
    ];

    private readonly responses: Record<string, string> = {
        'jollof': 'Jollof rice is a flavorful one-pot rice dish popular across West Africa. It\'s typically cooked in a rich tomato and pepper base. A culinary rivalry exists between Nigeria and Ghana over whose version is best!',
        'injera': 'Injera is a spongy, slightly sour fermented flatbread from Ethiopia and Eritrea, traditionally made from teff flour. It acts as both the plate and the utensil for stews and curries.',
        'spice': 'Popular African spices include **Berbere** (Ethiopian chili blend), **Ras el hanout** (North African complex mix), ginger, garlic, cloves, and cardamom. They add amazing depth to our dishes!',
        'street food': 'West African street food is vibrant! You\'ll find items like **Suya** (spicy grilled skewers), **Akara** (bean fritters), and roadside roasted plantains (Boli).',
        'default': 'That\'s an interesting question! African cuisine is incredibly diverse. I currently know most about Jollof, Injera, Spices, and Street food. Try asking about one of those!'
    };

    ngOnInit(): void {
        // Initial scroll
        setTimeout(() => this.scrollToBottom(), 100);
    }

    sendMessage(): void {
        const text = this.userInput.trim();
        if (!text || this.isBotTyping) return;

        this.messages.push({ type: 'user', text, time: new Date() });
        this.userInput = '';
        this.isBotTyping = true;
        this.scrollToBottom();

        setTimeout(() => {
            const botResponse = this.getBotResponse(text.toLowerCase());
            this.messages.push({ type: 'bot', text: botResponse, time: new Date() });
            this.isBotTyping = false;
            this.scrollToBottom();
        }, 700);
    }

    askQuestion(question: string): void {
        if (this.isBotTyping) return;
        this.userInput = question;
        this.sendMessage();
    }

    private getBotResponse(input: string): string {
        for (const key in this.responses) {
            if (Object.prototype.hasOwnProperty.call(this.responses, key) && input.includes(key)) {
                return this.responses[key];
            }
        }
        return this.responses['default'];
    }

    private scrollToBottom(): void {
        try {
            setTimeout(() => {
                if (this.messageContainer) {
                    const element = this.messageContainer.nativeElement;
                    element.scrollTo({
                        top: element.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 50);
        } catch (err) { }
    }

    trackByMessage(index: number, msg: ChatMessage): string {
        return `${index}-${msg.type}`;
    }
}
