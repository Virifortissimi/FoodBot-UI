import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-input-container">
      <input
        type="text"
        [(ngModel)]="message"
        (keyup.enter)="sendMessage()"
        placeholder="Ask about recipes, ingredients, or cooking tips..."
        class="chat-input"
      />
      <button (click)="sendMessage()" class="send-button">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `,
  styles: [`
    .chat-input-container {
      display: flex;
      gap: 10px;
      padding: 16px;
      background: white;
      border-top: 1px solid #e2e8f0;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .chat-input {
      flex: 1;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .chat-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .send-button {
      padding: 12px 24px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .send-button:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
    }
  `]
})
export class ChatInputComponent {
  message = '';
  @Output() send = new EventEmitter<string>();

  sendMessage() {
    if (!this.message.trim()) return;
    this.send.emit(this.message);
    this.message = '';
  }
}