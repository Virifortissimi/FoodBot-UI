import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nutritionist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="nutritionist-container">
      <h1>Speak with a Nutritionist</h1>

      <section class="consultation-options">
        <div class="option-card">
          <h2>Live Chat</h2>
          <p>Get quick answers to your nutrition questions</p>
          <button (click)="startLiveChat()">Start Chat</button>
        </div>

        <div class="option-card">
          <h2>Video Consultation</h2>
          <p>Schedule a video call with a certified nutritionist</p>
          <button (click)="scheduleConsultation()">Schedule Now</button>
        </div>
      </section>

      @if (showScheduler) {
        <section class="scheduler">
          <h2>Schedule Your Consultation</h2>
          <!-- Scheduler UI will be implemented here -->
        </section>
      }
    </div>
  `,
  styles: [`
    .nutritionist-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .consultation-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .option-card {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 15px;
    }

    .scheduler {
      margin-top: 30px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
  `]
})
export class NutritionistComponent {
  showScheduler = false;

  startLiveChat() {
    // Implement live chat functionality
  }

  scheduleConsultation() {
    this.showScheduler = true;
  }
}