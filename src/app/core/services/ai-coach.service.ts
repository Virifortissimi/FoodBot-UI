import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AiCoachMessage {
    role: 'assistant' | 'user';
    content: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class AiCoachService {
    private readonly apiUrl = `${environment.apiUrl}/recipechat`;
    private readonly systemPrompt = [
        'You are FoodBot AI Coach.',
        'Act as a practical nutrition and wellness coach for everyday users.',
        'Give concise, supportive guidance about meals, habits, grocery choices, hydration, macros, and healthy routines.',
        'Do not pretend to be a doctor.',
        'If the user asks for medical diagnosis or emergency advice, tell them to contact a licensed clinician.',
        'Keep responses conversational and useful.'
    ].join(' ');

    constructor(private http: HttpClient) { }

    async ask(messages: AiCoachMessage[], latestUserMessage: string): Promise<string> {
        const transcript = messages
            .slice(-8)
            .map(message => `${message.role === 'assistant' ? 'Coach' : 'User'}: ${message.content}`)
            .join('\n');

        const prompt = [
            this.systemPrompt,
            transcript ? `Conversation so far:\n${transcript}` : null,
            `User: ${latestUserMessage}`,
            'Coach:'
        ].filter(Boolean).join('\n\n');

        const response = await firstValueFrom(
            this.http.post<{ success: boolean; data: string; errors?: string[] }>(`${this.apiUrl}/ask`, { prompt })
        );

        if (!response?.success || !response?.data) {
            throw new Error(response?.errors?.[0] || 'Unable to reach the AI Coach right now.');
        }

        return response.data;
    }
}
