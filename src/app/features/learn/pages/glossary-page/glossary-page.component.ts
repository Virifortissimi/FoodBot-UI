import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlossaryService, GlossaryTerm } from '../../../../core/services/glossary.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-glossary-page',
  standalone: true,
  imports: [CommonModule, RevealDirective, StaggerDirective],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base); padding: 7rem 1.5rem 5rem;">
      <div style="max-width: 56rem; margin: 0 auto; " class="space-y-12">
        
        <header class="text-center space-y-4" fbReveal="up">
          <span class="type-overline" style="display: block;">Learning Hub</span>
          <h1 class="type-display" style="line-height: 1.1;">Nutrition <span style="color: var(--green-600);">Glossary</span></h1>
          <p class="type-body" style="max-width: 32rem; margin: 1.5rem auto 0;">
            Demystifying nutrition science one term at a time. Learn what goes into your body and why it matters.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" fbStagger [staggerStart]="100">
          <div *ngFor="let term of glossaryService.terms()" fbReveal="up" 
               class="card card-hover" style="padding: 2rem; display: flex; flex-direction: column;">
            
            <h2 class="type-title" style="color: var(--green-600); margin-bottom: 0.75rem;">{{ term.term }}</h2>
            <p class="type-body-s" style="line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1;">
              {{ term.definition }}
            </p>
            
            <div style="padding-top: 1.25rem; border-top: 1px solid var(--border-faint);" class="space-y-4">
              <div class="flex gap-3">
                <span style="font-size: 0.625rem; font-weight: 800; color: var(--ink-placeholder); text-transform: uppercase; tracking: 0.1em; shrink-0; margin-top: 0.25rem;">Why it matters:</span>
                <p class="type-body-s" style="font-size: 0.75rem; font-style: italic; color: var(--ink-secondary);">{{ term.whyItMatters }}</p>
              </div>
              
              <div class="card-accent" style="padding: 1rem; border-radius: 1.25rem; display: flex; gap: 0.75rem; background: var(--green-50); border: 1px solid var(--green-100);">
                <span style="font-size: 1.25rem; flex-shrink: 0;">💡</span>
                <p class="type-body-s" style="color: var(--green-800); font-weight: 600; line-height: 1.4; font-size: 0.75rem;">{{ term.foodBotTip }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="glossaryService.terms().length === 0" class="text-center py-20" fbReveal="up">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📖</div>
          <h3 class="type-title">Loading glossary...</h3>
          <p class="type-body-s">Preparing your nutrition dictionary.</p>
        </div>

      </div>
    </div>
  `
})
export class GlossaryPageComponent implements OnInit {
  private seoService = inject(SeoService);
  constructor(public glossaryService: GlossaryService) { }

  ngOnInit() {
    this.seoService.setPageMeta({
      title: 'Nutrition Glossary — Terms & Definitions',
      description: 'Demystifying nutrition science one term at a time. Learn what goes into your body and why it matters.',
      url: '/learn'
    });
    this.glossaryService.fetchTerms();
  }
}
