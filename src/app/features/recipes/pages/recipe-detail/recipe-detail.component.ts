import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService, Recipe } from '../../../../core/services/recipe.service';
import { SeoService } from '../../../../core/services/seo.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field.component';

@Component({
    selector: 'app-recipe-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, RevealDirective, StaggerDirective, ParticleFieldComponent],
    template: `
    <div *ngIf="recipe()" style="min-height: 100vh; background: var(--surface-base);">
      <!-- Hero Section -->
      <section class="relative overflow-hidden" style="padding: 8rem 2rem 5rem;">
        <div class="dot-grid-section" aria-hidden="true"></div>
        <fb-particle-field density="sparse" variant="light" />
        
        <div class="relative z-10" style="max-width: 1280px; margin: 0 auto;">
          <nav class="flex items-center gap-2 mb-8" fbReveal="up">
            <a routerLink="/recipes" class="nav-link" style="font-size: 0.875rem;">Recipes</a>
            <span style="color: var(--ink-placeholder);">/</span>
            <span style="font-size: 0.875rem; color: var(--ink-secondary); font-weight: 500;">{{ recipe()?.name }}</span>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div fbReveal="left">
              <span class="type-overline" style="display: block; margin-bottom: 1rem;">{{ recipe()?.dietaryTags?.[0] || 'Healthy Choice' }}</span>
              <h1 class="type-display" style="margin-bottom: 1.5rem; line-height: 1.1;">{{ recipe()?.name }}</h1>
              <p class="type-body" style="font-size: 1.125rem; color: var(--ink-secondary); margin-bottom: 2.5rem;">
                {{ recipe()?.description }}
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10" fbStagger>
                <div class="card-stat" style="padding: 1.25rem;">
                  <span style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--ink-placeholder); text-transform: uppercase; margin-bottom: 0.5rem;">Calories</span>
                  <span style="font-size: 1.5rem; font-weight: 800; color: var(--green-600);">{{ recipe()?.calories }}</span>
                </div>
                <div class="card-stat" style="padding: 1.25rem;">
                  <span style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--ink-placeholder); text-transform: uppercase; margin-bottom: 0.5rem;">Protein</span>
                  <span style="font-size: 1.5rem; font-weight: 800; color: var(--ink-primary);">{{ recipe()?.proteinG }}g</span>
                </div>
                <div class="card-stat" style="padding: 1.25rem;">
                  <span style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--ink-placeholder); text-transform: uppercase; margin-bottom: 0.5rem;">Prep</span>
                  <span style="font-size: 1.25rem; font-weight: 800; color: var(--ink-primary);">{{ recipe()?.prepTimeMinutes }}m</span>
                </div>
                <div class="card-stat" style="padding: 1.25rem;">
                  <span style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--ink-placeholder); text-transform: uppercase; margin-bottom: 0.5rem;">Cook</span>
                  <span style="font-size: 1.25rem; font-weight: 800; color: var(--ink-primary);">{{ recipe()?.cookTimeMinutes }}m</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-8">
                @for (tag of recipe()?.dietaryTags; track tag) {
                  <span class="tag tag-green">{{ tag }}</span>
                }
              </div>
            </div>

            <div class="relative" fbReveal="right">
              <div class="card" style="padding: 0; overflow: hidden; border-radius: 2rem;">
                <img [src]="recipe()?.imageUrl || 'assets/images/placeholder-recipe.png'" [alt]="recipe()?.name"
                     style="width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block;">
              </div>
              <!-- Floating Decoration -->
              <div class="card-glass" style="position: absolute; -bottom: 2rem; -left: 2rem; padding: 1.5rem; max-width: 240px;" fbReveal="up" [revealDelay]="400">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💡</div>
                <p style="font-size: 0.8125rem; font-weight: 600; line-height: 1.4; color: var(--green-900);">
                  This meal provides {{ (recipe()!.proteinG / 50 * 100) | number:'1.0-0' }}% of your daily protein target.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Grid -->
      <section style="max-width: 1280px; margin: 0 auto; padding: 0 2rem 10rem;">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div class="lg:col-span-8">
            <h2 class="type-title" style="margin-bottom: 2rem; font-size: 1.75rem;">Full Nutrition Breakdown</h2>
             <div class="card" style="padding: 2rem; margin-bottom: 4rem;">
                <div class="grid grid-cols-3 gap-8">
                  <div>
                    <span style="display: block; font-size: 0.875rem; color: var(--ink-secondary); margin-bottom: 0.5rem;">Carbohydrates</span>
                    <div style="height: 6px; background: var(--surface-subtle); border-radius: 100px; overflow: hidden; margin-bottom: 0.5rem;">
                      <div [style.width.%]="recipe()!.carbsG / (recipe()!.carbsG + recipe()!.fatG + recipe()!.proteinG) * 100" 
                           style="height: 100%; background: #0ea5e9;"></div>
                    </div>
                    <span style="font-weight: 700; color: var(--ink-primary);">{{ recipe()?.carbsG }}g</span>
                  </div>
                  <div>
                    <span style="display: block; font-size: 0.875rem; color: var(--ink-secondary); margin-bottom: 0.5rem;">Protein</span>
                    <div style="height: 6px; background: var(--surface-subtle); border-radius: 100px; overflow: hidden; margin-bottom: 0.5rem;">
                      <div [style.width.%]="recipe()!.proteinG / (recipe()!.carbsG + recipe()!.fatG + recipe()!.proteinG) * 100" 
                           style="height: 100%; background: var(--green-500);"></div>
                    </div>
                    <span style="font-weight: 700; color: var(--ink-primary);">{{ recipe()?.proteinG }}g</span>
                  </div>
                  <div>
                    <span style="display: block; font-size: 0.875rem; color: var(--ink-secondary); margin-bottom: 0.5rem;">Healthy Fats</span>
                    <div style="height: 6px; background: var(--surface-subtle); border-radius: 100px; overflow: hidden; margin-bottom: 0.5rem;">
                      <div [style.width.%]="recipe()!.fatG / (recipe()!.carbsG + recipe()!.fatG + recipe()!.proteinG) * 100" 
                           style="height: 100%; background: #f59e0b;"></div>
                    </div>
                    <span style="font-weight: 700; color: var(--ink-primary);">{{ recipe()?.fatG }}g</span>
                  </div>
                </div>
             </div>

             <div fbReveal="up">
                <h2 class="type-title" style="margin-bottom: 1.5rem;">About this dish</h2>
                <p class="type-body" style="line-height: 1.8; color: var(--ink-secondary);">
                  {{ recipe()?.description }} This recipe has been curated by the FoodBot nutrition team to ensure it delivers maximum flavour without compromising on your health goals. 
                  Whether you're tracking macros or just looking for a delicious meal, this dish is a fantastic choice.
                </p>
             </div>
          </div>

          <div class="lg:col-span-4" fbReveal="right">
            <div class="card sticky top-32" style="padding: 2.5rem; border: 1px solid var(--green-100); background: var(--green-50)/30;">
              <h3 class="type-title" style="font-size: 1.25rem; margin-bottom: 1.25rem;">Track this meal</h3>
              <p class="type-body-s" style="margin-bottom: 2rem; color: var(--green-900);">
                Add this {{ recipe()?.name }} directly to your daily nutrition log and watch your progress update in real-time.
              </p>
              <button class="btn-green w-full" style="margin-bottom: 1rem;">Log this Meal</button>
              <button class="btn-outline w-full text-green-700 border-green-200">Add to Meal Plan</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class RecipeDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private recipeService = inject(RecipeService);
    private seoService = inject(SeoService);

    recipe = signal<Recipe | null>(null);

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
            this.recipeService.getRecipeBySlug(slug).subscribe({
                next: (res) => {
                    this.recipe.set(res.data);
                    this.seoService.setRecipeMeta(res.data);
                }
            });
        }
    }
}
