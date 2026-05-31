import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EducationService {
    private apiUrl = `${environment.apiUrl}/education`;
    dismissedKeys = signal<string[]>([]);

    constructor(private http: HttpClient) { }

    fetchDismissals() {
        this.http.get<string[]>(`${this.apiUrl}/dismissals`).subscribe(keys => {
            this.dismissedKeys.set(keys);
        });
    }

    dismiss(key: string) {
        this.http.post(`${this.apiUrl}/dismiss/${key}`, {}).subscribe(() => {
            this.dismissedKeys.update(keys => [...keys, key]);
        });
    }

    isDismissed(key: string): boolean {
        return this.dismissedKeys().includes(key);
    }
}
