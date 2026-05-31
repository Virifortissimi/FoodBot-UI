import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section style="padding: 8rem 1rem 5rem; background:
      radial-gradient(circle at top right, rgba(22, 198, 90, 0.12), transparent 28%),
      linear-gradient(180deg, var(--surface-base), var(--surface-subtle));">
      <div style="max-width: 74rem; margin: 0 auto;" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
          <div class="card" style="padding: 2rem;">
            <p class="type-overline" style="margin-bottom: 1rem;">About FoodBot</p>
            <h1 class="type-display" style="margin-bottom: 1.25rem;">Healthy eating should feel doable in real life.</h1>
            <p class="type-body" style="font-size: 1.05rem; max-width: 42rem;">
              FoodBot exists to make planning meals, tracking nutrition, and building better food habits feel simpler,
              calmer, and more personal. We are building practical tools for real kitchens, not abstract wellness slogans.
            </p>
            <p class="type-body-s" style="margin-top: 1rem; max-width: 42rem;">
              FoodBot is an innovation by <a href="https://scalefort.africa" target="_blank" rel="noreferrer" style="color: var(--green-600); font-weight: 700; text-decoration: none;">Scalefort</a>,
              the company behind <a href="https://foodbot.ng" target="_blank" rel="noreferrer" style="color: var(--green-600); font-weight: 700; text-decoration: none;">foodbot.ng</a>.
            </p>

            <div class="flex flex-wrap gap-3" style="margin-top: 1.5rem;">
              <a routerLink="/contact" class="btn-green">Talk to Us</a>
              <a routerLink="/api-docs" class="btn-outline">View API Docs</a>
              <a href="https://scalefort.africa" target="_blank" rel="noreferrer" class="btn-outline">Visit Scalefort</a>
            </div>
          </div>

          <div class="card-glass" style="padding: 2rem; display: grid; gap: 1rem;">
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">What we believe</p>
              <p class="type-body-s">Nutrition guidance should be practical, culturally relevant, and easy to act on.</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="card-inset">
                <strong class="type-title">Recipes</strong>
                <p class="type-body-s">Built for daily cooking, not just inspiration.</p>
              </div>
              <div class="card-inset">
                <strong class="type-title">Planning</strong>
                <p class="type-body-s">Less decision fatigue, more consistency.</p>
              </div>
              <div class="card-inset">
                <strong class="type-title">Tracking</strong>
                <p class="type-body-s">Clarity without obsession.</p>
              </div>
              <div class="card-inset">
                <strong class="type-title">Coaching</strong>
                <p class="type-body-s">Support that fits real schedules.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="card">
            <p class="type-overline" style="margin-bottom: 0.75rem;">Mission</p>
            <h2 class="type-title" style="margin-bottom: 0.75rem;">Turn healthy eating into a repeatable system.</h2>
            <p class="type-body-s">
              We help people plan, shop, cook, and track in one connected experience instead of juggling disconnected apps.
            </p>
          </div>

          <div class="card">
            <p class="type-overline" style="margin-bottom: 0.75rem;">Approach</p>
            <h2 class="type-title" style="margin-bottom: 0.75rem;">Science-backed, product-first.</h2>
            <p class="type-body-s">
              We care about sound nutrition thinking, but we care just as much about whether people can actually use it every day.
            </p>
          </div>

          <div class="card">
            <p class="type-overline" style="margin-bottom: 0.75rem;">Audience</p>
            <h2 class="type-title" style="margin-bottom: 0.75rem;">Individuals, coaches, and partners.</h2>
            <p class="type-body-s">
              FoodBot is designed for everyday users and for teams who want nutrition workflows inside their own products.
            </p>
          </div>
        </div>

        <div class="card" style="padding: 2rem;">
          <div class="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-6 items-start">
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Parent company</p>
              <h2 class="type-title" style="margin-bottom: 0.75rem;">Built by Scalefort</h2>
              <p class="type-body-s">
                FoodBot is part of the Scalefort product portfolio and reflects Scalefort's focus on practical digital tools for African and global users.
              </p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">Where to find us</p>
              <div class="space-y-3">
                <p class="type-body-s"><strong>Product:</strong> <a href="https://foodbot.ng" target="_blank" rel="noreferrer" style="color: var(--green-600); font-weight: 700; text-decoration: none;">foodbot.ng</a></p>
                <p class="type-body-s"><strong>Company:</strong> <a href="https://scalefort.africa" target="_blank" rel="noreferrer" style="color: var(--green-600); font-weight: 700; text-decoration: none;">scalefort.africa</a></p>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="padding: 2rem;">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">01</p>
              <h3 class="type-title" style="margin-bottom: 0.5rem;">Real food contexts</h3>
              <p class="type-body-s">We design around actual meal choices, local habits, and practical constraints.</p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">02</p>
              <h3 class="type-title" style="margin-bottom: 0.5rem;">Clear interfaces</h3>
              <p class="type-body-s">The product should feel calm and understandable even when the data underneath is complex.</p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">03</p>
              <h3 class="type-title" style="margin-bottom: 0.5rem;">Connected workflows</h3>
              <p class="type-body-s">Planning should lead to shopping. Shopping should support cooking. Cooking should support tracking.</p>
            </div>
            <div class="card-inset">
              <p class="type-overline" style="margin-bottom: 0.5rem;">04</p>
              <h3 class="type-title" style="margin-bottom: 0.5rem;">Partner-ready platform</h3>
              <p class="type-body-s">We are also building the product with client integrations and APIs in mind.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AboutPageComponent { }
