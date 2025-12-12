import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.html',
    styleUrls: ['./contact.css']
})
export class ContactComponent {
    formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    isSubmitting = false;
    successMessage = '';

    faqs = [
        { question: 'How does FoodBot work?', answer: 'FoodBot uses AI to provide personalized meal plans based on your preferences.', open: false },
        { question: 'Is it free?', answer: 'Yes, basic features are free forever.', open: false },
        { question: 'Are recipes authentic?', answer: 'Yes, sourced from culinary experts across Africa.', open: false },
        { question: 'Can I customize plans?', answer: 'Absolutely! Our planner is fully customizable.', open: false }
    ];

    onSubmit() {
        this.isSubmitting = true;
        // Simulate API call
        setTimeout(() => {
            this.isSubmitting = false;
            this.successMessage = "Message sent successfully! We'll be in touch.";
            this.formData = { name: '', email: '', subject: '', message: '' };
        }, 1500);
    }

    toggleFaq(faq: any) {
        faq.open = !faq.open;
    }
}
