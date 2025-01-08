import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-member',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-member">
      <div class="member-image">
        <img [src]="image" [alt]="name">
      </div>
      <h3>{{ name }}</h3>
      <p class="role">{{ role }}</p>
      <p class="bio">{{ bio }}</p>
    </div>
  `,
  styles: [`
    .team-member {
      text-align: center;
    }

    .member-image {
      width: 200px;
      height: 200px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .member-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    h3 {
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .role {
      color: var(--primary);
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .bio {
      color: var(--text-light);
      line-height: 1.6;
    }
  `]
})
export class TeamMemberComponent {
  @Input() name = '';
  @Input() role = '';
  @Input() image = '';
  @Input() bio = '';
}