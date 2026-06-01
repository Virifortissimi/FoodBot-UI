import { Component, AfterViewInit, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field.component';
import { AuthService } from '../../../../core/services/auth.service';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, StaggerDirective, CountUpDirective, ParticleFieldComponent],
  templateUrl: './home-page.component.html',
  styles: [`
    .food-gallery-item { transition: transform 500ms var(--ease-snap), filter 400ms var(--ease-drift); }
    .food-gallery-item:hover { transform: scale(1.05) rotate(-1deg); filter: brightness(1.08); z-index: 2; }
    .testimonial-card { transition: transform 380ms var(--ease-snap), box-shadow 380ms var(--ease-snap); }
    .testimonial-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); }
    .feature-icon-wrap { transition: transform 320ms var(--ease-spring), box-shadow 320ms var(--ease-snap); }
    .feature-icon-wrap:hover { transform: scale(1.15) rotate(-3deg); box-shadow: 0 8px 24px rgba(22,198,90,0.15); }
    .who-card { transition: transform 340ms var(--ease-snap), box-shadow 340ms var(--ease-snap), border-color 200ms; }
    .who-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); border-color: var(--green-100); }
    .hero-mini-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-faint); }
    .hero-mini-stat { min-width: 0; }
    .hero-mini-stat strong { display: block; color: var(--ink-primary); font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; line-height: 1; }
    .hero-mini-stat span { display: block; margin-top: 0.35rem; color: var(--ink-tertiary); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0; }
    .mobile-platforms { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .platform-pill { display: inline-flex; align-items: center; gap: 0.5rem; min-height: 2.75rem; padding: 0 1rem; border: 1px solid var(--border-subtle); border-radius: 999px; background: var(--surface-base); color: var(--ink-primary); font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .platform-pill svg { color: var(--green-600); flex: 0 0 auto; }
    .mobile-mockup-stage { position: relative; min-height: 560px; display: flex; align-items: center; justify-content: center; overflow: visible; }
    .mobile-mockup-stage::before { content: ""; position: absolute; width: min(560px, 90vw); height: min(560px, 90vw); border-radius: 50%; background: radial-gradient(circle, rgba(22,198,90,0.2), rgba(245,158,11,0.08) 42%, rgba(255,255,255,0) 68%); transform: translate(8%, 2%); }
    .mobile-mockup-image { position: relative; z-index: 1; width: min(110%, 720px); max-width: none; display: block; filter: drop-shadow(0 34px 46px rgba(11,24,18,0.2)); }
    @media (min-width: 1024px) {
      .mobile-mockup-image { width: min(128%, 860px); transform: translateX(2.5rem) scale(1.06); }
    }
    @media (max-width: 767px) {
      .hero-mini-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mobile-coming-section { padding: 5rem 0 !important; }
      .mobile-mockup-stage { min-height: auto; margin-top: 1rem; }
      .mobile-mockup-image { width: min(116%, 520px); filter: drop-shadow(0 20px 28px rgba(11,24,18,0.16)); }
    }
    @keyframes float-soft { 0%, 100% { transform: translateY(0) rotate(1.5deg); } 50% { transform: translateY(-10px) rotate(1.5deg); } }
    .float-soft { animation: float-soft 5s ease-in-out infinite; }
    @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
    .wiggle-hover:hover { animation: wiggle 0.5s ease-in-out; }
  `]
})
export class HomePageComponent implements OnInit, AfterViewInit {
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);
  readonly authService = inject(AuthService);

  get primaryHeroCta() {
    return this.authService.token()
      ? { label: 'Go to Dashboard', link: '/dashboard' }
      : { label: "Start for Free — It's Easy", link: '/auth/register' };
  }

  get recipeChatCta() {
    return this.authService.token()
      ? { label: 'Open Recipe Chat', link: '/recipe-chat' }
      : { label: 'Try Chef Kora', link: '/recipe-chat' };
  }

  get mealPlanCta() {
    return this.authService.token()
      ? { label: 'Plan My Week', link: '/meal-planner' }
      : { label: 'Start My Free Plan', link: '/auth/register' };
  }

  get africanChefCta() {
    return this.authService.token()
      ? { label: 'Open African Recipe Chat', link: '/recipe-chat' }
      : { label: 'Try Chef Kora', link: '/recipe-chat' };
  }

  get finalCta() {
    return this.authService.token()
      ? { label: 'Open My Dashboard', link: '/dashboard' }
      : { label: 'Create My Free Account', link: '/auth/register' };
  }

  ngOnInit() {
    this.seoService.setPageMeta({
      title: 'FoodBot — AI-Powered Nutrition for Nigerians',
      description: 'FoodBot combines AI meal planning, a smart recipe assistant, and health tracking to help Nigerians eat well and reach their health goals.',
      url: '/'
    });
  }
  features = [
    { icon: '📅', title: 'Meal Planner', desc: 'Drag, drop, done. Build a full weekly plan in under 5 minutes — tailored to your goals, taste, and schedule.', link: '/meal-planner' },
    { icon: '🤖', title: 'AI Recipe Chat', desc: '"Hey FoodBot, what can I make with chicken, rice, and spinach?" — Get real recipes from real ingredients, instantly.', link: '/recipe-chat' },
    { icon: '👨‍⚕️', title: 'Nutritionist Chat', desc: 'No Googling. No guessing. Book a live session with a certified nutritionist who actually gets your goals.', link: '/contact' },
    { icon: '🛒', title: 'Smart Shopping Lists', desc: 'Your meal plan automatically becomes a shopping list. Check items off as you shop — no more forgotten ingredients.', link: '/shopping-list' },
    { icon: '📊', title: 'Health Tracking', desc: 'Log meals in seconds. Watch your calories, protein, carbs, and fat stack up against your daily targets.', link: '/nutrition' },
    { icon: '📚', title: 'Learn & Grow', desc: 'Short courses on meal prep, macro counting, and mindful eating — built by dietitians, not influencers.', link: '/learn' }
  ];

  testimonials = [
    { name: 'Amara O.', role: 'Busy Mum of 3', avatar: '👩🏾‍🍳', quote: "I used to spend 40 minutes every evening just deciding what to cook. Now FoodBot gives me a whole week's plan in minutes. My kids actually eat the food too!", rating: 5 },
    { name: 'James T.', role: 'Marathon Runner', avatar: '🏃🏽‍♂️', quote: "Tracking macros used to feel like a second job. FoodBot made it so simple I actually stuck with it. I've hit my protein goal every single day this month.", rating: 5 },
    { name: 'Priya S.', role: 'University Student', avatar: '👩🏻‍🎓', quote: "As a broke uni student, I love that FoodBot helps me eat healthy on a budget. The shopping list feature alone saves me £30 a week.", rating: 5 },
    { name: 'David K.', role: 'Recovering from Surgery', avatar: '🧔🏻', quote: "My nutritionist recommended FoodBot to help me track my recovery diet. The app is so intuitive — I actually look forward to logging my meals.", rating: 5 }
  ];

  whoCards = [
    { emoji: '🏋️‍♂️', title: 'Fitness Enthusiasts', desc: 'Hit your macros without the spreadsheet. Track protein, plan lean meals, and see real progress.' },
    { emoji: '👨‍👩‍👧‍👦', title: 'Busy Families', desc: 'Plan a week of dinners the whole family will eat — in 5 minutes flat. With a shopping list ready to go.' },
    { emoji: '🎓', title: 'Students on a Budget', desc: 'Eat well without breaking the bank. FoodBot finds recipes that match your pantry and your wallet.' },
    { emoji: '🌱', title: 'Health-Conscious Eaters', desc: 'Whether you\'re vegan, keto, gluten-free, or just curious — we tailor everything to you.' },
    { emoji: '🧑‍⚕️', title: 'People with Medical Diets', desc: 'Managing diabetes, allergies, or recovery? Your nutritionist can monitor your intake through FoodBot.' },
    { emoji: '👩‍🍳', title: 'Home Cooks Who Love Trying New Things', desc: 'Bored of the same 5 recipes? Ask our AI chef for something new — from Nigerian jollof to Japanese ramen.' }
  ];

  currentTestimonial = 0;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        setTimeout(() => document.querySelector('.hero-section')?.classList.add('hero-ready'), 60);
      });
    }

    // Auto-rotate testimonials
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
      }, 5000);
    }
  }
}
