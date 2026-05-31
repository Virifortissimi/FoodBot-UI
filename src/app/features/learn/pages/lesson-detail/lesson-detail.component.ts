import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LearningHubService } from '../../../../core/services/learning-hub.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base); padding: 7rem 1.5rem 5rem;">
      <div style="max-width: 48rem; margin: 0 auto; " class="space-y-12">
        
        <nav *ngIf="learningService.currentLesson() as lesson" fbReveal="left">
          <a [routerLink]="moduleOverviewLink(lesson)" 
             class="type-body-s" 
             style="font-weight: 800; color: var(--ink-placeholder); display: flex; align-items: center; gap: 0.5rem; text-decoration: none; transition: color 200ms;"
             class="hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Module Overview
          </a>
        </nav>

        <div *ngIf="learningService.currentLesson() as lesson" class="space-y-12 animate-fade-in">
          <header class="space-y-4" fbReveal="up">
            <div class="flex items-center gap-3">
              <span style="width: 2.5rem; height: 2.5rem; background: var(--green-500); color: white; border-radius: 0.875rem; display: flex; items-center; justify-content: center; font-size: 0.875rem; font-weight: 900;">
                {{ lesson.orderIndex }}
              </span>
              <h1 class="type-display" style="font-size: 2.5rem; line-height: 1.2;">{{ lesson.title }}</h1>
            </div>
          </header>

          <article class="card" style="padding: 3rem; border-radius: 2rem;" fbReveal="up">
            <div class="type-body" style="line-height: 1.8; color: var(--ink-secondary); margin-bottom: 3rem;">
               {{ lesson.content }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="card-accent" style="padding: 2rem; background: var(--green-50); border: 1px solid var(--green-100); border-radius: 1.5rem;">
                <div class="flex items-center gap-3 mb-4">
                  <span style="font-size: 1.5rem;">💡</span>
                  <h4 class="type-overline" style="color: var(--green-800); letter-spacing: 0.1em;">Did you know?</h4>
                </div>
                <p class="type-body-s" style="color: var(--green-900); font-style: italic; line-height: 1.6;">
                  {{ lesson.didYouKnow }}
                </p>
              </div>

              <div class="card-accent" style="padding: 2rem; background: var(--green-500); border-radius: 1.5rem;">
                <div class="flex items-center gap-3 mb-4">
                  <span style="font-size: 1.5rem;">🚀</span>
                  <h4 class="type-overline" style="color: white; opacity: 0.8; letter-spacing: 0.1em;">Try this today</h4>
                </div>
                <p class="type-body-s" style="color: white; font-weight: 500; line-height: 1.6;">
                  {{ lesson.tryThisToday }}
                </p>
              </div>
            </div>

            <div style="margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--border-faint); display: flex; justify-content: center;">
              <button (click)="markComplete(lesson.id)" 
                      [disabled]="completing"
                      class="btn-green btn-lg" style="padding-left: 3rem; padding-right: 3rem;">
                <svg *ngIf="!completing && !lesson.isCompleted" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;"><path d="M20 6 9 17l-5-5"/></svg>
                <div *ngIf="completing" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" style="margin-right: 0.5rem;"></div>
                {{ lesson.isCompleted ? 'Module Completed ✓' : 'Complete Module' }}
              </button>
            </div>
          </article>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 0.6s linear infinite; }
  `]
})
export class LessonDetailComponent implements OnInit {
  completing = false;

  constructor(
    private route: ActivatedRoute,
    public learningService: LearningHubService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.learningService.getLesson(params['slug']);
    });
  }

  moduleOverviewLink(lesson: { courseSlug?: string | null }): string[] {
    if (lesson.courseSlug) {
      return ['/learn/courses', lesson.courseSlug];
    }

    const currentCourseSlug = this.learningService.currentCourse()?.slug;
    return currentCourseSlug ? ['/learn/courses', currentCourseSlug] : ['/learn/courses'];
  }

  markComplete(id: string) {
    if (this.learningService.currentLesson()?.isCompleted) return;

    this.completing = true;
    this.learningService.completeLesson(id).subscribe({
      next: () => {
        this.completing = false;
        if (this.learningService.currentLesson()) {
          this.learningService.currentLesson()!.isCompleted = true;
        }
      },
      error: () => this.completing = false
    });
  }
}
