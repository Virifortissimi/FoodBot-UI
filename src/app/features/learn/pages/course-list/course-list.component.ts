import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LearningHubService } from '../../../../core/services/learning-hub.service';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, StaggerDirective],
  template: `
    <div style="min-height: 100vh; background: var(--surface-base); padding: 7rem 1.5rem 5rem;">
      <div style="max-width: 72rem; margin: 0 auto;" class="space-y-12">
        
        <header class="text-center space-y-4" fbReveal="up">
          <span class="type-overline" style="display: block;">Education</span>
          <h1 class="type-display" style="line-height: 1.05;">FoodBot <span style="color: var(--green-600);">University</span></h1>
          <p class="type-body" style="max-width: 32rem; margin: 1.5rem auto 0;">
            Interactive courses built by dietitians to help you master nutrition and build healthy habits that stick.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" fbStagger [staggerStart]="100">
          <div *ngFor="let course of learningService.courses()" fbReveal="up" 
               class="card card-hover group" style="padding: 2.5rem; display: flex; flex-direction: column;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
              <span class="tag" 
                    [style.background]="course.tierRequired === 'Pro' ? 'var(--green-500)' : 'var(--green-50)'"
                    [style.color]="course.tierRequired === 'Pro' ? 'white' : 'var(--green-600)'"
                    style="font-size: 0.625rem; font-weight: 800; padding: 0.25rem 0.75rem;">
                {{ course.tierRequired }}
              </span>
              <div style="width: 3.5rem; height: 3.5rem; border-radius: 1.25rem; background: var(--surface-subtle); display: flex; items-center; justify-content: center; font-size: 1.5rem; transition: transform 300ms;" class="group-hover:scale-110">
                📚
              </div>
            </div>

            <h2 class="type-title" style="margin-bottom: 0.75rem; min-height: 3.5rem; display: flex; align-items: flex-end;">{{ course.title }}</h2>
            <p class="type-body-s" style="line-height: 1.6; margin-bottom: 2rem; flex-grow: 1; color: var(--ink-secondary);">
              {{ course.description }}
            </p>

            <div class="space-y-4" style="margin-top: auto;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="type-overline" style="font-size: 0.625rem;">Progress</span>
                <span class="type-body-s" style="font-weight: 800; color: var(--ink-primary);">
                  {{ (course.completedCount / course.lessonCount * 100) | number:'1.0-0' }}%
                </span>
              </div>
              <div style="height: 0.5rem; width: 100%; background: var(--surface-subtle); border-radius: 100px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
                <div style="height: 100%; background: var(--green-500); border-radius: 100px; transition: width 1s ease;" 
                     [style.width.%]="(course.completedCount / course.lessonCount * 100)"></div>
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1rem;">
                <span class="type-body-s" style="font-size: 0.75rem;">{{ course.lessonCount }} Lessons</span>
                <a [routerLink]="['/learn/courses', course.slug]" 
                   class="btn-dark btn-sm" style="padding: 0.5rem 1.25rem;">
                   {{ course.completedCount > 0 ? 'Continue' : 'Start Course' }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="learningService.courses().length === 0" class="text-center py-20" fbReveal="up">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
          <h3 class="type-title">Class is meeting soon.</h3>
          <p class="type-body-s">We're preparing your first set of nutrition courses.</p>
        </div>

      </div>
    </div>
  `
})
export class CourseListComponent implements OnInit {
  constructor(public learningService: LearningHubService) { }

  ngOnInit() {
    this.learningService.fetchCourses();
  }
}
