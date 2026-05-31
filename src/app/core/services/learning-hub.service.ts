import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    tierRequired: string;
    lessonCount: number;
    completedCount: number;
}

export interface Lesson {
    id: string;
    courseId: string;
    courseSlug?: string;
    courseTitle?: string;
    title: string;
    slug: string;
    content: string;
    didYouKnow: string;
    tryThisToday: string;
    orderIndex: number;
    durationMinutes: number;
    isCompleted?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LearningHubService {
    private apiUrl = `${environment.apiUrl}/courses`;

    courses = signal<Course[]>([]);
    currentCourse = signal<any>(null);
    currentLesson = signal<Lesson | null>(null);

    constructor(private http: HttpClient) { }

    fetchCourses() {
        this.http.get<Course[]>(this.apiUrl).subscribe(data => {
            this.courses.set(data);
        });
    }

    getCourseDetails(slug: string) {
        this.http.get<any>(`${this.apiUrl}/${slug}`).subscribe(data => {
            this.currentCourse.set(data);
        });
    }

    getLesson(slug: string) {
        this.http.get<Lesson>(`${this.apiUrl}/lessons/${slug}`).subscribe(data => {
            this.currentLesson.set(data);
        });
    }

    completeLesson(lessonId: string, score?: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/lessons/${lessonId}/complete`, score || null).pipe(
            tap(() => {
                // Refresh progress
                if (this.currentCourse()) {
                    this.getCourseDetails(this.currentCourse().slug);
                }
                this.fetchCourses();
            })
        );
    }
}
