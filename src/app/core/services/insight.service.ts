import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface DashboardInsight {
    id: string;
    insightType: string;
    message: string;
    actions: InsightAction[];
    triggeredAt: string;
}

export interface InsightAction {
    label: string;
    routerLink: string;
}

@Injectable({
    providedIn: 'root'
})
export class InsightService {
    private apiUrl = `${environment.apiUrl}/insights`;
    insights = signal<DashboardInsight[]>([]);

    constructor(private http: HttpClient) { }

    fetchInsights() {
        this.http.get<DashboardInsight[]>(this.apiUrl).subscribe(data => {
            this.insights.set(data);
        });
    }

    dismiss(id: string) {
        this.http.post(`${this.apiUrl}/${id}/dismiss`, {}).subscribe(() => {
            this.insights.update(list => list.filter(i => i.id !== id));
        });
    }
}
