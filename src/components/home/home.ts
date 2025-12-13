import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, FooterComponent],
    templateUrl: './home.html',
    styleUrls: ['./home.css']
})
export class HomeComponent {
    currentYear = new Date().getFullYear();

    roots = [
        {
            title: "Shared Heritage",
            desc: "Honoring the culinary traditions passed down through generations of African families.",
            image: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Modern Wellness",
            desc: "Adapting ancient wisdom for today's busy lifestyles without losing the soul of the food.",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Community",
            desc: "Building a table where everyone is welcome to share, learn, and grow stronger together.",
            image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    stories = [
        {
            name: "Amara N.",
            role: "Busy Mom & Professional",
            quote: "I finally found a way to feed my family healthy meals that actually taste like home. The Jollof rice alternative urged by the AI was a game changer!",
            avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "David O.",
            role: "Fitness Enthusiast",
            quote: "I didn't know Fonio was such a protein powerhouse until I used FoodBot. Now it's my post-workout staple. Highly recommend.",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "Zainab A.",
            role: "Food Blogger",
            quote: "The visual appeal of this app is stunning, but the depth of nutritional knowledge about African ingredients is what keeps me coming back.",
            avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        }
    ];

    africanSuperfoods = [
        {
            name: "Moringa",
            benefit: "Vitamin C Powerhouse",
            funFact: "Often called the tree of life.",
            recipeIdea: "Morning Green Smoothie",
            image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            isFlipped: false
        },
        {
            name: "Baobab",
            benefit: "Antioxidant King",
            funFact: "Trees can live for 3,000 years.",
            recipeIdea: "Citrus Baobab Juice",
            image: "https://images.unsplash.com/photo-1621458872905-24fd65db72c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            isFlipped: false
        },
        {
            name: "Teff",
            benefit: "Iron & Calcium Rich",
            funFact: "Smallest grain in the world.",
            recipeIdea: "Sourdough Injera",
            image: "https://images.unsplash.com/photo-1486328228599-85db4443971f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            isFlipped: false
        },
        {
            name: "Fonio",
            benefit: "Gluten-Free Grain",
            funFact: "Known as 'seed of the universe'.",
            recipeIdea: "Fonio Jollof Bowl",
            image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            isFlipped: false
        }
    ];

    featuredRecipes = [
        {
            title: "Smoky Jollof Quinoa",
            category: "Dinner",
            calories: 320,
            image: "https://images.unsplash.com/photo-1574484284004-1cddd6942d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Plantain & Bean Stew",
            category: "Lunch",
            calories: 450,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Coconut Cassava Cake",
            category: "Dessert",
            calories: 180,
            image: "https://images.unsplash.com/photo-1619688467475-4d78a1bc7e16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    faqs = [
        {
            question: "Is FoodBot suitable for vegetarians?",
            answer: "Absolutely! African cuisine is naturally rich in plant-based options, and our AI can tailor any meal plan to be 100% vegetarian or vegan."
        },
        {
            question: "Do I need special cooking equipment?",
            answer: "Not at all. While we celebrate traditional methods, all our recipes are adapted for the modern kitchen. A pot, a pan, and a blender are usually all you need."
        },
        {
            question: "Can I use this for weight loss?",
            answer: "Yes. Our meal planner is designed to hit your specific macro and calorie goals while keeping you satisfied with nutrient-dense, fiber-rich African superfoods."
        }
    ];
}
