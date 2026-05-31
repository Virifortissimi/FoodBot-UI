import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardInsight, InsightAction } from '../../../../core/services/insight.service';

@Component({
  selector: 'app-dashboard-insight-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="insight-card">
      <div class="insight-card__glow" aria-hidden="true"></div>

      <div class="insight-card__content">
        <div class="insight-card__icon-shell">
          <span class="insight-card__icon" aria-hidden="true">{{ getIcon() }}</span>
        </div>

        <div class="insight-card__body">
          <p class="insight-card__message">{{ insight.message }}</p>

          <div class="insight-card__actions">
            <a
              *ngFor="let action of parsedActions"
              [routerLink]="action.routerLink"
              class="insight-card__action insight-card__action--primary">
              {{ action.label }}
            </a>

            <button
              type="button"
              (click)="onDismiss.emit(insight.id)"
              class="insight-card__action insight-card__action--secondary">
              Got It
            </button>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .insight-card {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(22, 198, 90, 0.18);
      border-radius: 1.6rem;
      background:
        radial-gradient(circle at top right, rgba(22, 198, 90, 0.12), transparent 30%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 251, 248, 0.98));
      box-shadow: 0 12px 34px rgba(15, 23, 42, 0.06);
      padding: 1.3rem 1.5rem;
    }

    .insight-card__glow {
      position: absolute;
      right: -2rem;
      top: -2rem;
      width: 9rem;
      height: 9rem;
      border-radius: 999px;
      background: rgba(22, 198, 90, 0.12);
      filter: blur(42px);
      pointer-events: none;
    }

    .insight-card__content {
      position: relative;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .insight-card__icon-shell {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      background: #1f2937;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .insight-card__icon {
      font-size: 1.35rem;
      line-height: 1;
    }

    .insight-card__body {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      flex: 1;
    }

    .insight-card__message {
      margin: 0;
      color: #111827;
      font-size: 0.98rem;
      font-weight: 600;
      line-height: 1.65;
    }

    .insight-card__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
    }

    .insight-card__action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.3rem;
      padding: 0.55rem 1rem;
      border-radius: 0.85rem;
      border: 1px solid transparent;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease, color 160ms ease;
    }

    .insight-card__action:hover {
      transform: translateY(-1px);
    }

    .insight-card__action--primary {
      background: #16c65a;
      color: #ffffff;
      box-shadow: 0 10px 24px rgba(22, 198, 90, 0.18);
    }

    .insight-card__action--primary:hover {
      background: #10b44f;
    }

    .insight-card__action--secondary {
      background: #1f2937;
      border-color: #374151;
      color: #f9fafb;
    }

    .insight-card__action--secondary:hover {
      background: #111827;
      border-color: #111827;
    }

    :host-context(.dark) .insight-card {
      border-color: rgba(209, 250, 223, 0.8);
      background:
        radial-gradient(circle at top right, rgba(22, 198, 90, 0.08), transparent 32%),
        linear-gradient(180deg, rgba(10, 12, 10, 0.96), rgba(13, 16, 13, 0.96));
      box-shadow: none;
    }

    :host-context(.dark) .insight-card__glow {
      background: rgba(22, 198, 90, 0.08);
    }

    :host-context(.dark) .insight-card__message {
      color: #f5f7f5;
    }

    :host-context(.dark) .insight-card__action--secondary {
      background: #1f2937;
      border-color: #374151;
      color: #f9fafb;
    }

    @media (max-width: 640px) {
      .insight-card {
        padding: 1.1rem 1rem;
      }

      .insight-card__content {
        gap: 0.85rem;
      }

      .insight-card__message {
        font-size: 0.92rem;
      }
    }
  `]
})
export class DashboardInsightCardComponent {
  @Input({ required: true }) insight!: DashboardInsight;
  @Output() onDismiss = new EventEmitter<string>();

  get parsedActions(): InsightAction[] {
    return Array.isArray(this.insight.actions) ? this.insight.actions : [];
  }

  getIcon(): string {
    if (this.insight.insightType.includes('Protein')) return '\u{1F957}';
    if (this.insight.insightType.includes('Calorie')) return '\u2696\uFE0F';
    if (this.insight.insightType.includes('Weight')) return '\u{1F4C9}';
    if (this.insight.insightType.includes('Hydration')) return '\u{1F4A7}';
    if (this.insight.insightType.includes('Streak')) return '\u{1F525}';
    if (this.insight.insightType.includes('Fibre')) return '\u{1F33E}';
    if (this.insight.insightType.includes('Sodium')) return '\u{1F9C2}';
    if (this.insight.insightType.includes('Goal')) return '\u{1F38A}';
    if (this.insight.insightType.includes('Weekly')) return '\u{1F4C5}';
    return '\u{1F4A1}';
  }
}
