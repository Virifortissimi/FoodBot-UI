import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './about.html',
    styleUrls: ['./about.css']
})
export class AboutComponent {
    commitments = [
        { emoji: '🌾', title: 'Traditional Recipes', desc: 'Authentic sourcing' },
        { emoji: '🤖', title: 'AI Technology', desc: 'Personalized planning' },
        { emoji: '👨‍⚕️', title: 'Expert Guidance', desc: 'Certified nutritionists' },
        { emoji: '🌍', title: 'Global Community', desc: 'Connecting cultures' }
    ];
}
