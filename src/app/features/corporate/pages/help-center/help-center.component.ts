import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section style="padding: 8rem 1rem 5rem; background: var(--surface-base);">
      <div style="max-width: 56rem; margin: 0 auto;">
        <p class="type-overline" style="margin-bottom: 1rem;">Support</p>
        <h1 class="type-display" style="margin-bottom: 3rem;">How can we help?</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8" style="margin-bottom: 5rem;">
          <div *ngFor="let section of [
            {title:'Getting Started', items:['Creating your FoodBot account','Setting up your nutrition profile','Understanding your dashboard']},
            {title:'Meal Planner', items:['Building your first meal plan','Using AI meal plan generation','Editing and customising meals']},
            {title:'Health Tracking', items:['Logging meals manually','Connecting fitness trackers','Understanding your nutrition reports']},
            {title:'Nutritionist Chat', items:['How to book a session','What to expect in your session']},
            {title:'Marketplace', items:['Browsing and ordering products','Delivery and returns']},
            {title:'Account & Billing', items:['Changing your plan','Updating payment details','Cancelling your subscription']},
            {title:'Troubleshooting', items:['Login issues','AI chat not responding']}
          ]">
            <h2 class="type-title" style="margin-bottom: 0.75rem;">{{section.title}}</h2>
            <ul style="list-style: none; padding: 0;" class="space-y-2">
              <li *ngFor="let item of section.items">
                <a href="#" class="type-body-s" style="text-decoration: none; transition: color 130ms;">{{item}}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="card card-accent text-center" style="padding: 3rem;">
          <h2 class="type-title" style="margin-bottom: 0.5rem;">Still Need Help?</h2>
          <p class="type-body" style="margin-bottom: 1.5rem;">Our support team is always here to assist you.</p>
          <a routerLink="/contact" class="btn-green" style="display: inline-flex;">Contact Support</a>
        </div>
      </div>
    </section>
  `
})
export class HelpCenterComponent { }
