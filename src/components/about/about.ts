import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink, FooterComponent],
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
