import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-pricing',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, FooterComponent],
    templateUrl: './pricing.html',
    styleUrls: ['./pricing.css']
})
export class PricingComponent {
    isYearly = false;

    starterFeatures = [
        'Basic meal planning',
        'Access to 100+ recipes',
        'Community support',
        'Mobile app access'
    ];

    proFeatures = [
        'Everything in Starter',
        'AI-powered recommendations',
        'Nutritional analysis',
        'Priority support',
        'Offline access'
    ];

    premiumFeatures = [
        'Everything in Pro',
        '1-on-1 Nutritionist chat',
        'Custom meal plans',
        'Shopping list integration',
        'Early access to new features'
    ];

    featureComparison = [
        { name: 'Recipes', starter: '100+', pro: 'Unlimited', premium: 'Unlimited' },
        { name: 'Meal Planner', starter: true, pro: true, premium: true },
        { name: 'AI Suggestions', starter: false, pro: true, premium: true },
        { name: 'Nutrition Analysis', starter: false, pro: true, premium: true },
        { name: 'Expert Chat', starter: false, pro: false, premium: true },
        { name: 'Offline Mode', starter: false, pro: true, premium: true },
    ];

    faqs = [
        { question: 'Can I cancel anytime?', answer: 'Yes, cancel your subscription at any time with no questions asked.', open: false },
        { question: 'Is there a free trial?', answer: 'Yes, try Pro or Premium free for 14 days.', open: false },
        { question: 'What payment methods?', answer: 'We accept all major credit cards, PayPal, and Apple Pay.', open: false },
        { question: 'Can I switch plans?', answer: 'Absolutely! Upgrade or downgrade whenever you like.', open: false }
    ];

    toggleBilling() {
        // Logic to update prices if needed, currently handled in template via isYearly
    }

    toggleFaq(faq: any) {
        faq.open = !faq.open;
    }

    isBool(val: any): boolean {
        return typeof val === 'boolean';
    }
}
