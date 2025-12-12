import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.html',
    styleUrls: ['./home.css']
})
export class HomeComponent {
    currentYear = new Date().getFullYear();

    roots = [
        {
            title: "Shared Heritage",
            desc: "Honoring the culinary traditions passed down through generations of African families.",
            image: "https://images.pexels.com/photos/4552135/pexels-photo-4552135.jpeg"
        },
        {
            title: "Modern Wellness",
            desc: "Adapting ancient wisdom for today's busy lifestyles without losing the soul of the food.",
            image: "https://images.pexels.com/photos/4050990/pexels-photo-4050990.jpeg"
        },
        {
            title: "Community",
            desc: "Building a table where everyone is welcome to share, learn, and grow stronger together.",
            image: "https://images.pexels.com/photos/6999238/pexels-photo-6999238.jpeg"
        }
    ];

    stories = [
        {
            name: "Amara N.",
            role: "Busy Mom & Professional",
            quote: "I finally found a way to feed my family healthy meals that actually taste like home. The Jollof rice alternative urged by the AI was a game changer!",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
        },
        {
            name: "David O.",
            role: "Fitness Enthusiast",
            quote: "I didn't know Fonio was such a protein powerhouse until I used FoodBot. Now it's my post-workout staple. Highly recommend.",
            avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
        },
        {
            name: "Zainab A.",
            role: "Food Blogger",
            quote: "The visual appeal of this app is stunning, but the depth of nutritional knowledge about African ingredients is what keeps me coming back.",
            avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
        }
    ];

    africanSuperfoods = [
        {
            name: "Moringa",
            benefit: "Vitamin C Powerhouse",
            funFact: "Often called the tree of life.",
            recipeIdea: "Morning Green Smoothie",
            image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
            isFlipped: false
        },
        {
            name: "Baobab",
            benefit: "Antioxidant King",
            funFact: "Trees can live for 3,000 years.",
            recipeIdea: "Citrus Baobab Juice",
            image: "https://images.pexels.com/photos/4198016/pexels-photo-4198016.jpeg",
            isFlipped: false
        },
        {
            name: "Teff",
            benefit: "Iron & Calcium Rich",
            funFact: "Smallest grain in the world.",
            recipeIdea: "Sourdough Injera",
            image: "https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg",
            isFlipped: false
        },
        {
            name: "Fonio",
            benefit: "Gluten-Free Grain",
            funFact: "Known as 'seed of the universe'.",
            recipeIdea: "Fonio Jollof Bowl",
            image: "https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg",
            isFlipped: false
        }
    ];
}
