import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ChatInputComponent } from './chat-input.component';
import { ChatMessageComponent } from './chat-message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChatInputComponent, ChatMessageComponent],
  template: `
    <div class="chat-container">
      <div class="chat-messages" #messagesContainer>
        @for (message of messages; track message.id) {
          <app-chat-message
            [text]="message.text"
            [isUser]="message.isUser"
            [timestamp]="message.timestamp"
          />
        }
      </div>
      <app-chat-input (send)="sendMessage($event)" />
    </div>
  `,
  styles: [`
    .chat-container {
      height: calc(100vh - 64px); /* Adjust based on your header height */
      display: flex;
      flex-direction: column;
      background: white;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      padding-bottom: 80px; /* Space for input */
      display: flex;
      flex-direction: column;
    }

    /* Custom scrollbar */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class ChatComponent {
  messages: Array<{
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }> = [];

  constructor(private chatService: ChatService) {}

  sendMessage(text: string) {
    const userMessage = {
      id: this.messages.length,
      text,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.scrollToBottom();

    this.chatService.sendMessage(text).subscribe(response => {
      this.messages.push({
        id: this.messages.length,
        text: response,
        isUser: false,
        timestamp: new Date()
      });
      this.scrollToBottom();
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    });
  }
}