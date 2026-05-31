import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LearningHubService } from '../../../../core/services/learning-hub.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, StaggerDirective],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base); padding: 7rem 1.5rem 5rem;">
      <div style="max-width: 56rem; margin: 0 auto;" class="space-y-12">
        
        <nav fbReveal="left">
          <a routerLink="/learn/courses" class="type-body-s" 
             style="font-weight: 800; color: var(--ink-placeholder); display: flex; align-items: center; gap: 0.5rem; text-decoration: none; transition: color 200ms;"
             class="hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Courses
          </a>
        </nav>

        <div *ngIf="learningService.currentCourse() as course" class="space-y-16">
          <header class="space-y-6" fbReveal="up">
            <div class="flex items-center gap-3">
               <span class="tag-green tag">Personalized Path</span>
               <span class="type-overline" style="color: var(--ink-placeholder);">{{ course.lessons?.length || 0 }} Modules</span>
            </div>
            <h1 class="type-display" style="line-height: 1.1;">{{ course.title }}</h1>
            <p class="type-body" style="max-width: 42rem; line-height: 1.8;">
              {{ course.description }}
            </p>
          </header>

          <div class="space-y-8">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3 class="type-overline" style="letter-spacing: 0.1em;">Course Curriculum</h3>
                <span class="type-body-s" style="font-weight: 800; color: var(--green-600);">Step-by-step Mastery</span>
            </div>
            
            <div class="space-y-4" fbStagger [staggerStart]="100">
              <div *ngFor="let lesson of course.lessons; let i = index" fbReveal="up"
                   class="card card-hover" style="padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between;">
                
                <div class="flex items-center gap-6">
                  <div [style.background]="lesson.isCompleted ? 'var(--green-500)' : 'var(--surface-subtle)'"
                       [style.color]="lesson.isCompleted ? 'white' : 'var(--ink-placeholder)'"
                       style="width: 2.75rem; height: 2.75rem; border-radius: 1rem; display: flex; items-center; justify-content: center; font-size: 1rem; font-weight: 800; transition: all 300ms;">
                    <span *ngIf="!lesson.isCompleted">{{ i + 1 }}</span>
                    <svg *ngIf="lesson.isCompleted" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  
                  <div class="space-y-1">
                    <h4 class="type-title" style="font-size: 1.125rem;">{{ lesson.title }}</h4>
                    <div class="flex items-center gap-4 text-xs font-bold text-neutral-400">
                      <span class="flex items-center gap-1.5 type-body-s" style="font-size: 0.7rem; color: var(--ink-secondary);">
                         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                         {{ lesson.durationMinutes }} Minute Read
                      </span>
                    </div>
                  </div>
                </div>

                <a [routerLink]="['/learn/lessons', lesson.slug]" 
                   [class]="lesson.isCompleted ? 'btn-outline' : 'btn-dark'"
                   style="padding: 0.5rem 1.5rem; font-size: 0.75rem;">
                   {{ lesson.isCompleted ? 'Review' : 'Start Now' }}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CourseDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public learningService: LearningHubService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.learningService.getCourseDetails(params['slug']);
    });
  }
}
