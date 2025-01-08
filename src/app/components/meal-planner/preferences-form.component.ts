import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="preferences-form">
      <div class="options-grid">
        <div class="option-section">
          <h3>Dietary Restrictions</h3>
          <div class="options-container">
            @for (restriction of availableRestrictions; track restriction) {
              <label class="option-chip" [class.selected]="isRestrictionSelected(restriction)">
                <input
                  type="checkbox"
                  [value]="restriction"
                  (change)="toggleRestriction(restriction)"
                  class="hidden-input"
                />
                <span class="chip-content">
                  <i class="fas fa-check check-icon"></i>
                  {{ restriction }}
                </span>
              </label>
            }
          </div>
        </div>

        <div class="option-section">
          <h3>Health Goals</h3>
          <div class="options-container">
            @for (goal of availableGoals; track goal) {
              <label class="option-chip" [class.selected]="isGoalSelected(goal)">
                <input
                  type="checkbox"
                  [value]="goal"
                  (change)="toggleGoal(goal)"
                  class="hidden-input"
                />
                <span class="chip-content">
                  <i class="fas fa-check check-icon"></i>
                  {{ goal }}
                </span>
              </label>
            }
          </div>
        </div>
      </div>

      <button class="generate-button" (click)="generatePlan()">
        <i class="fas fa-wand-magic-sparkles"></i>
        Generate AI Meal Plan
      </button>
    </div>
  `,
  styles: [`
    .preferences-form {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .options-grid {
      display: grid;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .option-section h3 {
      color: white;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .options-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .option-chip {
      cursor: pointer;
      user-select: none;
    }

    .hidden-input {
      display: none;
    }

    .chip-content {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 100px;
      color: white;
      transition: all 0.3s ease;
    }

    .option-chip:hover .chip-content {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .option-chip.selected .chip-content {
      background: var(--primary);
      border-color: var(--primary);
    }

    .check-icon {
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease;
    }

    .option-chip.selected .check-icon {
      opacity: 1;
      transform: scale(1);
    }

    .generate-button {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .generate-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 768px) {
      .options-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class PreferencesFormComponent {
  @Output() planGenerated = new EventEmitter<{
    restrictions: string[];
    goals: string[];
  }>();

  availableRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Low-carb',
    'Keto',
    'Paleo'
  ];

  availableGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Better Energy',
    'Heart Health',
    'Immune Boost',
    'Better Sleep',
    'Mental Focus'
  ];

  selectedRestrictions: Set<string> = new Set();
  selectedGoals: Set<string> = new Set();

  isRestrictionSelected(restriction: string): boolean {
    return this.selectedRestrictions.has(restriction);
  }

  isGoalSelected(goal: string): boolean {
    return this.selectedGoals.has(goal);
  }

  toggleRestriction(restriction: string) {
    if (this.selectedRestrictions.has(restriction)) {
      this.selectedRestrictions.delete(restriction);
    } else {
      this.selectedRestrictions.add(restriction);
    }
  }

  toggleGoal(goal: string) {
    if (this.selectedGoals.has(goal)) {
      this.selectedGoals.delete(goal);
    } else {
      this.selectedGoals.add(goal);
    }
  }

  generatePlan() {
    this.planGenerated.emit({
      restrictions: Array.from(this.selectedRestrictions),
      goals: Array.from(this.selectedGoals)
    });
  }
}