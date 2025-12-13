import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishDate: string;
    readTime: string;
    category: string;
    imageUrl: string;
    featured: boolean;
}

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [CommonModule, RouterLink, FooterComponent],
    templateUrl: './blog.html',
    styleUrls: ['./blog.css']
})
export class BlogComponent {
    blogPosts: BlogPost[] = [
        {
            id: 1,
            title: "The Power of Moringa: Africa's Miracle Tree",
            excerpt: "Discover why moringa is considered one of the most nutrient-dense plants on earth and how to incorporate it into your daily diet for boosted energy and immunity.",
            content: "Full content about moringa...",
            author: "Dr. Amina Bello",
            publishDate: "Jan 15, 2024",
            readTime: "5 min read",
            category: "Superfoods",
            imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Better Image
            featured: true
        },
        {
            id: 2,
            title: "Traditional West African Cooking Techniques",
            excerpt: "Explore the ancient cooking methods that make West African cuisine both delicious and nutritious, from fermentation to slow cooking.",
            content: "Full content about cooking techniques...",
            author: "Chef Kwame Asante",
            publishDate: "Jan 12, 2024",
            readTime: "7 min read",
            category: "Cooking",
            imageUrl: "https://images.pexels.com/photos/357737/pexels-photo-357737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            featured: false
        },
        {
            id: 3,
            title: "Baobab: The Ancient African Superfruit",
            excerpt: "Learn about the incredible health benefits of baobab fruit and its traditional uses across Africa. A true vitamin C powerhouse.",
            content: "Full content about baobab...",
            author: "Nutritionist Fatima",
            publishDate: "Jan 10, 2024",
            readTime: "4 min read",
            category: "Superfoods",
            imageUrl: "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            featured: false
        },
        {
            id: 4,
            title: "The Science Behind African Fermented Foods",
            excerpt: "How traditional fermentation enhances nutrition and supports gut health in African cuisine. The probiotics you didn't know you needed.",
            content: "Full content about fermented foods...",
            author: "Dr. Chidi Okonkwo",
            publishDate: "Jan 8, 2024",
            readTime: "6 min read",
            category: "Nutrition",
            imageUrl: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            featured: false
        },
        {
            id: 5,
            title: "Teff: Ethiopia's Ancient Grain Powerhouse",
            excerpt: "Why this tiny grain packs a massive nutritional punch and how to use it in modern cooking. Gluten-free and full of iron.",
            content: "Full content about teff...",
            author: "Chef Selam Tadesse",
            publishDate: "Jan 5, 2024",
            readTime: "5 min read",
            category: "Grains",
            imageUrl: "https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            featured: false
        },
        {
            id: 6,
            title: "African Spices and Their Health Benefits",
            excerpt: "From berbere to suya spice, discover how African spices boost flavor and wellness in every bite.",
            content: "Full content about spices...",
            author: "Dr. Ngozi Eze",
            publishDate: "Jan 3, 2024",
            readTime: "4 min read",
            category: "Spices",
            imageUrl: "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            featured: false
        }
    ];

    get featuredPost(): BlogPost | undefined {
        return this.blogPosts.find(post => post.featured);
    }

    loadMorePosts(): void {
        // In a real app, this would load more posts from an API
        console.log('Loading more posts...');
        alert('More posts would be loaded from the server in a real application.');
    }
}
