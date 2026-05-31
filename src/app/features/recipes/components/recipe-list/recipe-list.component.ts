import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { RecipeService, Recipe } from '../../../../core/services/recipe.service';
import { ParticleFieldComponent } from '../../../../shared/components/particle-field/particle-field.component';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { SeoService } from '../../../../core/services/seo.service';
import { AuthService } from '../../../../core/services/auth.service';

type RecipeViewMode = 'cards' | 'list' | 'maze' | 'compact' | 'bento' | 'split';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ParticleFieldComponent, RouterModule, RevealDirective, StaggerDirective],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base);">
      <section class="relative overflow-hidden" style="padding: 7rem 2rem 4rem;">
        <div class="dot-grid-section" aria-hidden="true"></div>
        <fb-particle-field density="sparse" variant="light" />

        <div class="relative z-10" style="max-width: 1280px; margin: 0 auto;">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="type-overline" style="display: block; margin-bottom: 1rem;">Curated Recipes</span>
              <h1 class="type-display" fbReveal="up" style="margin-bottom: 1rem;">
                Real recipes.<br>
                <span style="color: var(--green-600);">Real nutrition.</span>
              </h1>
              <p class="type-body" fbReveal="up" style="font-size: 1.0625rem; margin-bottom: 2rem;">
                Every recipe comes with a full nutritional breakdown - calories, protein, carbs, fat, and more.
                Switch between card, list, maze, compact, bento, and split views to browse the way you want.
              </p>
              <div class="flex flex-wrap items-center gap-4" fbReveal="up">
                <div style="font-size: 0.875rem; font-weight: 700; color: var(--ink-primary);">
                  {{ total() }} <span class="type-body-s">recipes available</span>
                </div>
                <div class="tag" style="background: var(--surface-subtle); border-color: var(--border-default);">
                  Page {{ page() }} of {{ totalPages() }}
                </div>
                @if (browseCap()) {
                  <div class="tag" style="background: var(--surface-subtle); border-color: var(--green-100); color: var(--green-700);">
                    Current plan shows first {{ browseCap() }} recipes
                  </div>
                }
              </div>
            </div>
            <div class="hidden lg:block" fbReveal="right">
              <img src="assets/images/hero-bowl.png" alt="Healthy food"
                style="width: 100%; max-width: 400px; border-radius: 1.5rem; box-shadow: 0 20px 60px rgba(0,0,0,0.1); display: block; margin-left: auto;">
            </div>
          </div>
        </div>
      </section>

      <section style="max-width: 1280px; margin: 0 auto; padding: 3rem 2rem 5rem;">
        <div class="card-glass flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          style="padding: 1rem 1.25rem; margin-bottom: 2rem;">
          <div>
            <p class="type-overline" style="margin-bottom: 0.35rem;">Browse Recipes</p>
            <p class="type-body-s" style="margin: 0;">
              Showing {{ visibleRangeStart() }}-{{ visibleRangeEnd() }} of {{ total() }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            @for (option of viewOptions; track option.value) {
              <button
                type="button"
                (click)="setViewMode(option.value)"
                class="view-mode-button"
                [class.view-mode-button-active]="viewMode() === option.value">
                <span class="view-mode-icon">{{ option.icon }}</span>
                <span>{{ option.label }}</span>
              </button>
            }
          </div>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (i of skeletonItems; track i) {
              <div style="height: 400px; background: var(--surface-subtle); border-radius: 1rem;" class="animate-pulse"></div>
            }
          </div>
        } @else if (recipes().length === 0) {
          <div class="flex flex-col items-center justify-center text-center" style="padding: 5rem 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
            <h2 class="type-heading" style="margin-bottom: 0.5rem;">No recipes yet</h2>
            <p class="type-body" style="margin-bottom: 2rem;">Recipes will appear here as they're added. Try Chef Amara in the meantime!</p>
            <a routerLink="/recipe-chat" class="btn-green">Ask Chef Amara</a>
          </div>
        } @else {
          @if (viewMode() === 'cards') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" fbStagger>
              @for (recipe of recipes(); track recipe.id) {
                <article fbReveal="up" class="group cursor-pointer card card-hover" style="padding: 0; overflow: hidden;"
                  [routerLink]="['/recipes', recipe.slug]">
                  <div class="relative recipe-card-image-wrap">
                    @if (recipe.imageUrl) {
                      <img [ngSrc]="recipe.imageUrl" fill [alt]="recipe.name"
                        style="object-fit: cover; transition: transform 500ms ease;" class="group-hover:scale-105">
                    } @else {
                      <div class="recipe-image-fallback">🍽️</div>
                    }

                    <div class="recipe-tag-overlay">
                      @for (tag of recipe.dietaryTags.slice(0, 2); track tag) {
                        <span class="card-glass recipe-tag-chip">{{ tag }}</span>
                      }
                    </div>
                  </div>

                  <div style="padding: 1.25rem;">
                    <div class="flex items-start justify-between gap-3" style="margin-bottom: 0.625rem;">
                      <h3 class="recipe-title">{{ recipe.name }}</h3>
                      <span class="tag recipe-cuisine-tag">{{ recipe.cuisine }}</span>
                    </div>
                    <p class="type-body-s recipe-description-clamp">
                      {{ recipe.description }}
                    </p>
                    <div class="recipe-stat-row">
                      <span>🔥 {{ recipe.calories }} kcal</span>
                      <span class="recipe-dot"></span>
                      <span>💪 {{ recipe.proteinG }}g protein</span>
                    </div>
                  </div>
                </article>
              }
            </div>
          }

          @if (viewMode() === 'list') {
            <div class="space-y-4">
              @for (recipe of recipes(); track recipe.id) {
                <article class="card card-hover recipe-list-item" [routerLink]="['/recipes', recipe.slug]">
                  <div class="recipe-list-image-wrap">
                    @if (recipe.imageUrl) {
                      <img [ngSrc]="recipe.imageUrl" fill [alt]="recipe.name" style="object-fit: cover;">
                    } @else {
                      <div class="recipe-image-fallback">🍲</div>
                    }
                  </div>

                  <div class="recipe-list-content">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 class="recipe-title" style="margin-bottom: 0.4rem;">{{ recipe.name }}</h3>
                        <p class="type-body-s" style="margin: 0; color: var(--ink-secondary);">
                          {{ recipe.cuisine }} cuisine
                        </p>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        @for (tag of recipe.dietaryTags.slice(0, 3); track tag) {
                          <span class="tag recipe-cuisine-tag">{{ tag }}</span>
                        }
                      </div>
                    </div>

                    <p class="type-body" style="margin: 1rem 0 1.25rem; line-height: 1.7;">
                      {{ recipe.description }}
                    </p>

                    <div class="recipe-list-stats">
                      <div><span class="type-overline">Calories</span><strong>{{ recipe.calories }}</strong></div>
                      <div><span class="type-overline">Protein</span><strong>{{ recipe.proteinG }}g</strong></div>
                      <div><span class="type-overline">Carbs</span><strong>{{ recipe.carbsG }}g</strong></div>
                      <div><span class="type-overline">Fat</span><strong>{{ recipe.fatG }}g</strong></div>
                    </div>
                  </div>
                </article>
              }
            </div>
          }

          @if (viewMode() === 'maze') {
            <div class="maze-layout">
              @for (recipe of recipes(); track recipe.id; let i = $index) {
                <article class="card card-hover maze-card" [routerLink]="['/recipes', recipe.slug]"
                  [style.margin-top.px]="i % 3 === 1 ? 24 : (i % 3 === 2 ? 52 : 0)">
                  <div class="maze-image" [style.aspect-ratio]="mazeAspectRatio(i)">
                    @if (recipe.imageUrl) {
                      <img [ngSrc]="recipe.imageUrl" fill [alt]="recipe.name" style="object-fit: cover;">
                    } @else {
                      <div class="recipe-image-fallback">🥘</div>
                    }
                  </div>

                  <div style="padding: 1rem 1rem 1.1rem;">
                    <div class="flex items-center justify-between gap-3" style="margin-bottom: 0.65rem;">
                      <span class="tag recipe-cuisine-tag">{{ recipe.cuisine }}</span>
                      <span class="type-body-s">{{ recipe.calories }} kcal</span>
                    </div>
                    <h3 class="recipe-title" style="font-size: 1rem; margin-bottom: 0.5rem;">{{ recipe.name }}</h3>
                    <p class="type-body-s recipe-description-clamp" [style.-webkit-line-clamp]="i % 2 === 0 ? 3 : 4">
                      {{ recipe.description }}
                    </p>
                  </div>
                </article>
              }
            </div>
          }

          @if (viewMode() === 'compact') {
            <div class="space-y-3">
              @for (recipe of recipes(); track recipe.id) {
                <article class="card card-hover compact-row" [routerLink]="['/recipes', recipe.slug]">
                  <div class="compact-thumb">
                    @if (recipe.imageUrl) {
                      <img [ngSrc]="recipe.imageUrl" fill [alt]="recipe.name" style="object-fit: cover;">
                    } @else {
                      <div class="recipe-image-fallback" style="font-size: 2rem;">🥗</div>
                    }
                  </div>

                  <div class="compact-content">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 class="recipe-title" style="font-size: 1rem;">{{ recipe.name }}</h3>
                        <p class="type-body-s" style="margin: 0.2rem 0 0; color: var(--ink-secondary);">
                          {{ recipe.cuisine }} · {{ recipe.proteinG }}g protein
                        </p>
                      </div>
                      <span class="tag recipe-cuisine-tag">{{ recipe.calories }} kcal</span>
                    </div>
                    <p class="type-body-s recipe-description-clamp" [style.-webkit-line-clamp]="2"
                      style="margin-top: 0.65rem;">
                      {{ recipe.description }}
                    </p>
                  </div>
                </article>
              }
            </div>
          }

          @if (viewMode() === 'bento') {
            <div class="bento-grid">
              @for (recipe of recipes(); track recipe.id; let i = $index) {
                <article class="card card-hover bento-card"
                  [class.bento-card-wide]="i % 5 === 0"
                  [class.bento-card-tall]="i % 4 === 2"
                  [routerLink]="['/recipes', recipe.slug]">
                  <div class="bento-image" [style.aspect-ratio]="bentoAspectRatio(i)">
                    @if (recipe.imageUrl) {
                      <img [ngSrc]="recipe.imageUrl" fill [alt]="recipe.name" style="object-fit: cover;">
                    } @else {
                      <div class="recipe-image-fallback">🍛</div>
                    }
                    <div class="bento-overlay">
                      <span class="tag bento-tag">{{ recipe.cuisine }}</span>
                      <span class="tag bento-tag">{{ recipe.calories }} kcal</span>
                    </div>
                  </div>
                  <div style="padding: 1rem 1rem 1.15rem;">
                    <h3 class="recipe-title" style="margin-bottom: 0.5rem;">{{ recipe.name }}</h3>
                    <p class="type-body-s recipe-description-clamp" [style.-webkit-line-clamp]="i % 5 === 0 ? 4 : 3">
                      {{ recipe.description }}
                    </p>
                  </div>
                </article>
              }
            </div>
          }

          @if (viewMode() === 'split' && selectedRecipe(); as activeRecipe) {
            <div class="split-layout">
              <div class="split-list card">
                <div class="split-header">
                  <p class="type-overline" style="margin: 0;">Preview Mode</p>
                  <p class="type-body-s" style="margin: 0;">Select a recipe to inspect it before opening.</p>
                </div>

                <div class="split-list-items">
                  @for (recipe of recipes(); track recipe.id) {
                    <button
                      type="button"
                      class="split-list-item"
                      [class.split-list-item-active]="recipe.id === activeRecipe.id"
                      (click)="selectRecipe(recipe.id)">
                      <div class="split-list-item-copy">
                        <strong>{{ recipe.name }}</strong>
                        <span>{{ recipe.cuisine }}</span>
                      </div>
                      <div class="split-list-item-meta">
                        <span>{{ recipe.calories }} kcal</span>
                        <span>{{ recipe.proteinG }}g protein</span>
                      </div>
                    </button>
                  }
                </div>
              </div>

              <article class="card split-preview">
                <div class="split-preview-image">
                  @if (activeRecipe.imageUrl) {
                    <img [ngSrc]="activeRecipe.imageUrl" fill [alt]="activeRecipe.name" style="object-fit: cover;">
                  } @else {
                    <div class="recipe-image-fallback">🍱</div>
                  }
                </div>

                <div class="split-preview-body">
                  <div class="flex flex-wrap items-center gap-2" style="margin-bottom: 0.9rem;">
                    <span class="tag recipe-cuisine-tag">{{ activeRecipe.cuisine }}</span>
                    @for (tag of activeRecipe.dietaryTags.slice(0, 3); track tag) {
                      <span class="tag recipe-cuisine-tag">{{ tag }}</span>
                    }
                  </div>

                  <h2 class="type-heading" style="margin-bottom: 0.75rem;">{{ activeRecipe.name }}</h2>
                  <p class="type-body" style="line-height: 1.8; margin-bottom: 1.25rem;">
                    {{ activeRecipe.description }}
                  </p>

                  <div class="split-preview-stats">
                    <div><span class="type-overline">Calories</span><strong>{{ activeRecipe.calories }}</strong></div>
                    <div><span class="type-overline">Protein</span><strong>{{ activeRecipe.proteinG }}g</strong></div>
                    <div><span class="type-overline">Carbs</span><strong>{{ activeRecipe.carbsG }}g</strong></div>
                    <div><span class="type-overline">Fat</span><strong>{{ activeRecipe.fatG }}g</strong></div>
                  </div>

                  <div style="margin-top: 1.5rem;">
                    <a class="btn-green" [routerLink]="['/recipes', activeRecipe.slug]">Open Recipe</a>
                  </div>
                </div>
              </article>
            </div>
          }

          <div class="pagination-shell">
            <div class="type-body-s" style="margin: 0;">
              Showing {{ visibleRangeStart() }}-{{ visibleRangeEnd() }} of {{ total() }} recipes
            </div>

            <div class="pagination-controls">
              <button type="button" class="pagination-button" (click)="goToPreviousPage()" [disabled]="page() === 1">
                Previous
              </button>

              @for (pageNumber of pageNumbers(); track pageNumber) {
                <button
                  type="button"
                  class="pagination-button"
                  [class.pagination-button-active]="pageNumber === page()"
                  (click)="goToPage(pageNumber)">
                  {{ pageNumber }}
                </button>
              }

              <button
                type="button"
                class="pagination-button"
                (click)="goToNextPage()"
                [disabled]="page() === totalPages()">
                Next
              </button>
            </div>
          </div>
        }
      </section>
    </div>
  `,
  styles: [':host { display: block; }']
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private seoService = inject(SeoService);
  private viewportScroller = inject(ViewportScroller);
  private authService = inject(AuthService);

  readonly viewOptions: Array<{ value: RecipeViewMode; label: string; icon: string }> = [
    { value: 'cards', label: 'Cards', icon: '[]' },
    { value: 'list', label: 'List', icon: '==' },
    { value: 'maze', label: 'Maze', icon: '##' },
    { value: 'compact', label: 'Compact', icon: '--' },
    { value: 'bento', label: 'Bento', icon: '++' },
    { value: 'split', label: 'Split', icon: '><' }
  ];
  readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  readonly recipes = signal<Recipe[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly browseCap = signal<number | null>(null);
  readonly viewMode = signal<RecipeViewMode>('cards');
  readonly selectedRecipeId = signal<string | null>(null);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  readonly visibleRangeStart = computed(() => this.total() === 0 ? 0 : ((this.page() - 1) * this.pageSize()) + 1);
  readonly visibleRangeEnd = computed(() => Math.min(this.page() * this.pageSize(), this.total()));
  readonly selectedRecipe = computed(() => {
    const items = this.recipes();
    const selectedId = this.selectedRecipeId();
    return items.find(recipe => recipe.id === selectedId) ?? items[0] ?? null;
  });
  readonly pageNumbers = computed(() => {
    const totalPages = this.totalPages();
    const currentPage = this.page();
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  });

  ngOnInit() {
    this.seoService.setPageMeta({
      title: 'Healthy Recipes & Nutrition Facts',
      description: 'Explore our collection of authentic Nigerian and international recipes with full nutritional breakdowns.',
      url: '/recipes'
    });
    this.loadRecipes();
  }

  setViewMode(mode: RecipeViewMode): void {
    this.viewMode.set(mode);
    if (mode === 'split' && !this.selectedRecipe() && this.recipes()[0]) {
      this.selectedRecipeId.set(this.recipes()[0].id);
    }
  }

  selectRecipe(recipeId: string): void {
    this.selectedRecipeId.set(recipeId);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages() || pageNumber === this.page()) {
      return;
    }

    this.page.set(pageNumber);
    this.loadRecipes();
  }

  goToPreviousPage(): void {
    this.goToPage(this.page() - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.page() + 1);
  }

  mazeAspectRatio(index: number): string {
    const patterns = ['4 / 4.8', '4 / 3.4', '4 / 5.4', '4 / 4.1'];
    return patterns[index % patterns.length];
  }

  bentoAspectRatio(index: number): string {
    const patterns = ['16 / 10', '4 / 5', '4 / 4.8', '16 / 11'];
    return patterns[index % patterns.length];
  }

  private loadRecipes(): void {
    this.loading.set(true);
    this.recipeService.getRecipes(this.page(), this.pageSize()).subscribe({
      next: (res) => {
        this.recipes.set(res.data);
        this.total.set(res.meta.total);
        this.browseCap.set(this.authService.user() ? (res.meta.browseCap ?? null) : null);
        this.loading.set(false);
        this.selectedRecipeId.set(res.data[0]?.id ?? null);
        this.viewportScroller.scrollToPosition([0, 0]);
      },
      error: () => this.loading.set(false)
    });
  }
}
