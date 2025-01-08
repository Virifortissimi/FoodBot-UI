import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message" [class.user-message]="isUser">
      <div class="message-content">
        {{ text }}
      </div>
      <div class="message-time">
        {{ timestamp | date:'shortTime' }}
      </div>
    </div>
  `,
  styles: [`
    .message {
      margin: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      max-width: 70%;
      animation: slideIn 0.3s ease-out;
    }

    .user-message {
      background: var(--primary);
      color: white;
      margin-left: auto;
    }

    .message:not(.user-message) {
      background: #f1f5f9;
      color: var(--text);
    }

    .message-time {
      font-size: 0.75rem;
      opacity: 0.8;
      margin-top: 4px;
    }

    @keyframes slideIn {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ChatMessageComponent {
  @Input() text = '';
  @Input() isUser = false;
  @Input() timestamp: Date = new Date();
}