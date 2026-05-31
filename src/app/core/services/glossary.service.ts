import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface GlossaryTerm {
    id: string;
    term: string;
    slug: string;
    definition: string;
    whyItMatters: string;
    foodBotTip: string;
}

@Injectable({
    providedIn: 'root'
})
export class GlossaryService {
    private apiUrl = `${environment.apiUrl}/glossary`;
    terms = signal<GlossaryTerm[]>([]);

    constructor(private http: HttpClient) { }

    fetchTerms() {
        this.http.get<GlossaryTerm[]>(this.apiUrl).subscribe({
            next: data => this.terms.set(data),
            error: () => this.terms.set([])
        });
    }

    getTerm(slug: string) {
        return this.http.get<GlossaryTerm>(`${this.apiUrl}/${slug}`);
    }
}
