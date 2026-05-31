import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type PaymentProvider = 'paystack' | 'flutterwave';

export interface SubscriptionPlan {
    key: 'pro' | 'coach';
    name: string;
    monthlyAmount: number;
    annualAmount: number;
    annualEquivalentMonthlyAmount: number;
    currency: string;
    currencySymbol: string;
}

export interface SubscriptionMarketContext {
    regionGroup: 'nigeria' | 'africa' | 'global';
    countryCode: string;
    currencyCode: 'NGN';
    currencySymbol: string;
    provider: PaymentProvider;
    supportedProviders: PaymentProvider[];
    usesPaystack: boolean;
    usesFlutterwave: boolean;
}

export interface SubscriptionCatalogResponse {
    market: SubscriptionMarketContext;
    plans: SubscriptionPlan[];
}

export interface CheckoutInitResponse {
    provider: PaymentProvider;
    authorizationUrl: string;
    reference: string;
}

export interface CancelSubscriptionResponse {
    provider: PaymentProvider;
    cancelled: boolean;
    cancelAtPeriodEnd: boolean;
    managementUrl?: string | null;
    status: string;
    currentPeriodEnd?: string | null;
    message?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private apiUrl = `${environment.apiUrl}/subscriptions`;

    constructor(private http: HttpClient) { }

    getPlans(localeCountryCode?: string | null, timeZone?: string | null): Observable<{ success: boolean; data: SubscriptionCatalogResponse }> {
        const params = new URLSearchParams();

        if (localeCountryCode) {
            params.set('localeCountryCode', localeCountryCode);
        }

        if (timeZone) {
            params.set('timeZone', timeZone);
        }

        const url = params.toString()
            ? `${this.apiUrl}/plans?${params.toString()}`
            : `${this.apiUrl}/plans`;

        return this.http.get<{ success: boolean; data: SubscriptionCatalogResponse }>(url);
    }

    initialize(
        planKey: 'pro' | 'coach',
        billingCycle: 'monthly' | 'annual',
        successUrl?: string,
        cancelUrl?: string,
        localeCountryCode?: string | null,
        timeZone?: string | null
    ): Observable<{ success: boolean; data: CheckoutInitResponse }> {
        return this.http.post<{ success: boolean; data: CheckoutInitResponse }>(`${this.apiUrl}/initialize`, {
            planKey,
            billingCycle,
            successUrl,
            cancelUrl,
            localeCountryCode,
            timeZone
        });
    }

    verify(reference: string, provider?: PaymentProvider): Observable<{ success: boolean; data: { verified: boolean; status: string; provider: string } }> {
        const query = provider ? `?provider=${provider}` : '';
        return this.http.get<{ success: boolean; data: { verified: boolean; status: string; provider: string } }>(`${this.apiUrl}/verify/${reference}${query}`);
    }

    cancel(): Observable<{ success: boolean; data: CancelSubscriptionResponse }> {
        return this.http.post<{ success: boolean; data: CancelSubscriptionResponse }>(`${this.apiUrl}/cancel`, {});
    }
}
