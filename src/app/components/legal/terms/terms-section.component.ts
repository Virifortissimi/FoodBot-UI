import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ContentItem {
  type: 'text' | 'list';
  content?: string;
  title?: string;
  items?: string[];
}

@Component({
  selector: 'app-terms-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="terms-section">
      <h2>{{ title }}</h2>
      @for (item of content; track $index) {
        @if (item.type === 'text') {
          <p>{{ item.content }}</p>
        }
        @if (item.type === 'list') {
          <div class="list-container">
            @if (item.title) {
              <p>{{ item.title }}</p>
            }
            <ul>
              @for (listItem of item.items; track listItem) {
                <li>{{ listItem }}</li>
              }
            </ul>
          </div>
        }
      }
    </section>
  `,
  styles: [`
    .terms-section {
      margin-bottom: 2.5rem;
    }

    h2 {
      color: var(--text);
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .list-container {
      margin-bottom: 1rem;
    }

    ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
  `]
})
export class TermsSectionComponent {
  @Input() title = '';
  @Input() content: ContentItem[] = [];
}