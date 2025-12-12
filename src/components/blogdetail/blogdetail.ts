import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

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
    selector: 'app-blog-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './blogdetail.html',
    styleUrls: ['./blogdetail.css']
})
export class BlogDetailComponent implements OnInit {
    blogPost: BlogPost | undefined;
    relatedPosts: BlogPost[] = [];
    loading = true;

    private allPosts: BlogPost[] = [
        {
            id: 1,
            title: "The Power of Moringa: Africa's Miracle Tree",
            excerpt: "Discover why moringa is considered one of the most nutrient-dense plants on earth and how to incorporate it into your daily diet.",
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
            excerpt: "Explore the ancient cooking methods that make West African cuisine both delicious and nutritious.",
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
            excerpt: "Learn about the incredible health benefits of baobab fruit and its traditional uses across Africa.",
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
            excerpt: "How traditional fermentation enhances nutrition and supports gut health in African cuisine.",
            content: "Full content about fermented foods...",
            author: "Dr. Chidi Okonkwo",
            publishDate: "Jan 8, 2024",
            readTime: "6 min read",
            category: "Nutrition",
            imageUrl: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            featured: false
        }
    ];

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const postId = +params['id'];
            this.loadBlogPost(postId);
            window.scrollTo(0, 0);
        });
    }

    loadBlogPost(postId: number): void {
        this.loading = true;
        setTimeout(() => {
            this.blogPost = this.allPosts.find(post => post.id === postId);
            this.loadRelatedPosts();
            this.loading = false;
        }, 600);
    }

    loadRelatedPosts(): void {
        if (!this.blogPost) return;

        this.relatedPosts = this.allPosts
            .filter(post => post.id !== this.blogPost!.id && post.category === this.blogPost!.category)
            .slice(0, 2);

        if (this.relatedPosts.length < 2) {
            const additionalPosts = this.allPosts
                .filter(post => post.id !== this.blogPost!.id && !this.relatedPosts.includes(post))
                .slice(0, 2 - this.relatedPosts.length);
            this.relatedPosts = [...this.relatedPosts, ...additionalPosts];
        }
    }
}
