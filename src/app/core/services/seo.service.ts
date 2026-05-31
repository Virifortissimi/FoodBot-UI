import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Recipe } from '../services/recipe.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
    private isBrowser: boolean;

    constructor(
        private meta: Meta,
        private titleService: Title,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(PLATFORM_ID) platformId: object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    /**
     * Dedicated method for Recipe pages as per SEO Guide Section 5.7
     */
    setRecipeMeta(recipe: Recipe): void {
        const title = `${recipe.name} Recipe — Calories & Nutrition | FoodBot`;
        this.titleService.setTitle(title);

        const description = this.buildRecipeDescription(recipe);
        this.meta.updateTag({ name: 'description', content: description });

        // Open Graph
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: recipe.imageUrl || '' });
        this.meta.updateTag({ property: 'og:url', content: `https://foodbot.io/recipes/${recipe.slug}` });
        this.meta.updateTag({ property: 'og:type', content: 'article' });

        // Twitter
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:site', content: '@foodbot_ng' });
        this.meta.updateTag({ name: 'twitter:image', content: recipe.imageUrl || '' });

        // Canonical
        this.setCanonical(`/recipes/${recipe.slug}`);

        // JSON-LD (Section 5.1 & 5.4)
        this.injectJsonLd(this.buildRecipeSchema(recipe), 'recipe-jsonld');
        this.injectJsonLd(this.buildBreadcrumbSchema([
            { name: 'Home', url: 'https://foodbot.io' },
            { name: 'Recipes', url: 'https://foodbot.io/recipes' },
            { name: recipe.name },
        ]), 'breadcrumb-jsonld');
    }

    setPageMeta(data: { title: string; description: string; url: string; image?: string; noindex?: boolean }): void {
        const fullTitle = `${data.title} | FoodBot`;
        this.titleService.setTitle(fullTitle);
        this.meta.updateTag({ name: 'description', content: data.description });

        if (data.noindex) {
            this.setNoIndex();
        } else {
            this.meta.updateTag({ name: 'robots', content: 'index, follow' });
        }

        this.meta.updateTag({ property: 'og:title', content: fullTitle });
        this.meta.updateTag({ property: 'og:description', content: data.description });
        if (data.image) this.meta.updateTag({ property: 'og:image', content: data.image });
        this.meta.updateTag({ property: 'og:url', content: `https://foodbot.io${data.url}` });

        this.setCanonical(data.url);
    }

    setCanonical(path: string): void {
        const url = `https://foodbot.io${path}`;
        let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement
            ?? this.doc.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        if (!link.parentNode) this.doc.head.appendChild(link);
    }

    setNoIndex(): void {
        this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    }

    private injectJsonLd(schema: object, id: string): void {
        // Remove existing if any
        const existing = this.doc.getElementById(id);
        if (existing) existing.remove();

        const script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.text = JSON.stringify(schema);
        this.doc.head.appendChild(script);
    }

    private buildRecipeDescription(recipe: Recipe): string {
        return `Make ${recipe.name} at home. ${recipe.calories} calories, `
            + `${recipe.proteinG}g protein per serving. Full nutrition info, `
            + `step-by-step instructions — track it automatically on FoodBot.`;
    }

    private buildRecipeSchema(recipe: Recipe): object {
        return {
            "@context": "https://schema.org",
            "@type": "Recipe",
            "name": recipe.name,
            "description": recipe.description,
            "image": [recipe.imageUrl],
            "author": { "@type": "Organization", "name": "FoodBot Kitchen" },
            "nutrition": {
                "@type": "NutritionInformation",
                "calories": `${recipe.calories} calories`,
                "proteinContent": `${recipe.proteinG} g`,
                "carbohydrateContent": `${recipe.carbsG} g`,
                "fatContent": `${recipe.fatG} g`
            },
            "recipeCategory": "Main Course",
            "recipeCuisine": recipe.cuisine || "Nigerian",
            "keywords": recipe.dietaryTags.join(', ')
        };
    }

    private buildBreadcrumbSchema(items: { name: string; url?: string }[]): object {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": item.name,
                "item": item.url
            }))
        };
    }
}
