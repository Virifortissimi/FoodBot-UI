import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding: 8rem 1rem 5rem; background: var(--surface-base);">
      <div style="max-width: 56rem; margin: 0 auto;">
        <p class="type-overline" style="margin-bottom: 1rem;">Careers</p>
        <h1 class="type-display" style="margin-bottom: 1.5rem;">Help Feed the Future</h1>
        <p class="type-body" style="font-size: 1.125rem; margin-bottom: 3rem;">
          We're building tools that make healthy eating accessible to everyone.
          Join a team that cares about people, science, and great products.
        </p>

        <h2 class="type-title" style="margin-bottom: 1.5rem;">Why FoodBot?</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4" style="list-style: none; padding: 0; margin-bottom: 4rem;">
          <li *ngFor="let perk of [
            {icon:'🚀', title:'Mission-driven', desc:'We genuinely believe nutrition changes lives.'},
            {icon:'🏠', title:'Remote-first', desc:'Flexible hours, work from anywhere.'},
            {icon:'💰', title:'Competitive Salaries', desc:'Competitive salaries + equity for every team member.'},
            {icon:'🎓', title:'Professional Growth', desc:'Learning & development budget for every role.'},
            {icon:'🥑', title:'Free Premium', desc:'A free FoodBot Premium subscription (obviously).'},
            {icon:'🤝', title:'Inclusive Culture', desc:'Join a diverse team building for everyone.'}
          ]" class="card flex items-start gap-3">
            <span style="font-size: 1.25rem;">{{perk.icon}}</span>
            <div>
              <p style="font-weight: 700; color: var(--ink-primary);">{{perk.title}}</p>
              <p class="type-body-s">{{perk.desc}}</p>
            </div>
          </li>
        </ul>

        <div class="card card-accent text-center" style="padding: 3rem;">
          <h2 class="type-title" style="margin-bottom: 0.75rem;">No open roles that fit?</h2>
          <p class="type-body" style="margin-bottom: 1.5rem;">We're always interested in exceptional people. Send us your CV.</p>
          <a href="mailto:careers@foodbot.io" class="btn-green" style="display: inline-flex;">Send us your CV</a>
        </div>
      </div>
    </section>
  `
})
export class CareersPageComponent { }
