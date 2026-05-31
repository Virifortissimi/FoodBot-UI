import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../models/toast.model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts: Toast[] = [];
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastsSubject.asObservable();
    private nextId = 0;

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 5000) {
        const normalizedMessage = this.normalizeMessage(message, type);
        const id = this.nextId++;
        const toast: Toast = { id, message: normalizedMessage, type, duration };
        this.toasts.push(toast);
        this.toastsSubject.next([...this.toasts]);

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }
    }

    success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }

    remove(id: number) {
        this.toasts = this.toasts.filter(t => t.id !== id);
        this.toastsSubject.next([...this.toasts]);
    }

    private normalizeMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): string {
        const normalized = (message ?? '').toString().trim();
        if (normalized) {
            return normalized;
        }

        if (type === 'success') {
            return 'Action completed successfully.';
        }

        if (type === 'error') {
            return 'An unexpected error occurred.';
        }

        if (type === 'warning') {
            return 'Please check your input and try again.';
        }

        return 'Action completed.';
    }
}
