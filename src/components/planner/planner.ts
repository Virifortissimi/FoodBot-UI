import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor, TitleCasePipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [CommonModule, FormsModule, NgIf, NgFor, TitleCasePipe, DatePipe],
    templateUrl: './planner.html',
    styleUrls: ['./planner.css']
})
export class PlannerComponent {
    daysToplan: string = '7';
    dietaryPreference: string = 'balanced';
    budgetLevel: string = 'moderate';
    targetCuisine: string = '';

    isLoading: boolean = false;
    mealPlan: any[] | null = null;
    currentTimestamp: number = Date.now();

    dayOptions = [
        { label: '3 Days', value: '3' },
        { label: '5 Days', value: '5' },
        { label: '7 Days', value: '7' }
    ];

    private coreMealData: { [key: string]: { breakfast: string[], lunch: string[], dinner: string[], tips: string[] } } = {
        'balanced-moderate': {
            breakfast: ['Akara (Bean Fritters) with Pap', 'Spicy Scrambled Eggs with Bread', 'Ogi (Fermented Cornmeal) with Moin Moin'],
            lunch: ['Jollof Rice with Grilled Fish', 'West African Peanut Soup with Fufu', 'Nigerian Stew with Rice and Plantain'],
            dinner: ['Kenyan Nyama Choma with Ugali', 'Ethiopian Misir Wot (Lentil Stew) with Injera', 'South African Bobotie'],
            tips: ['Prep your meat/fish marinade the night before.', 'Make a large batch of stew base for easy lunches.', 'Use whole grains like fonio or millet instead of rice once this week.'],
        },
        'vegetarian-budget-friendly': {
            breakfast: ['Fruit salad with natural yogurt', 'Sweet potato hash with leafy greens', 'Vegetable Porridge'],
            lunch: ['Black-eyed Pea Stew with rice', 'Vegetable Suya Skewers (Tofu/Mushroom)', 'Aloo Gobi (Curried Potatoes and Cauliflower)'],
            dinner: ['Vegan Fufu with Okra Soup', 'Butternut Squash Tagine with Chickpeas', 'Ghanaian Red Red (Beans and Plantain)'],
            tips: ['Soak beans overnight to reduce cooking time.', 'Use seasonal vegetables for maximum savings.', 'Spice your plantains heavily for flavor.'],
        },
        'vegan-premium': {
            breakfast: ['Hemp seed porridge with exotic fruit', 'Avocado toast with balsamic glaze', 'Açai bowl with shredded coconut and nuts'],
            lunch: ['Moroccan Spiced Carrot Soup', 'Quinoa/Fonio Buddha Bowl with grilled vegetables', 'Sweet Potato & Coconut Curry'],
            dinner: ['Cashew cream vegetable stew over brown rice', 'Gourmet Vegetable Tagine with saffron couscous', 'African Root Vegetable Bake'],
            tips: ['Source organic and local produce.', 'Invest in high-quality oils (olive, coconut).', 'Don\'t forget fresh herbs for presentation.'],
        },
        'low-carb-moderate': {
            breakfast: ['Eggs scrambled with spinach and pepper', 'Smoked fish with a small avocado', 'Grilled halloumi with tomatoes'],
            lunch: ['Large salad with chicken or fish', 'Meat skewers (Suya style) with vegetables', 'Cauliflower rice with spicy stew'],
            dinner: ['Grilled Lamb Chops with sautéed greens', 'West African Fish Curry (no starch)', 'Chicken and Vegetable Skewers'],
            tips: ['Focus on lean protein and vegetables.', 'Use butter/oil for satiety.', 'Avoid sauces with hidden sugars.'],
        },
        'low-carb-budget-friendly': {
            breakfast: ['Hard-boiled eggs (2) with tomatoes', 'Peanut butter on cucumber slices', 'Cheese and pepper omelet'],
            lunch: ['Tuna/Sardine salad', 'Groundnut stew (small portion) with spinach', 'Leftover dinner'],
            dinner: ['Baked chicken drumsticks with cabbage', 'Mackerel with cooked greens', 'Egg-based stir fry'],
            tips: ['Eggs are great for budget protein.', 'Cabbage and spinach are great fillers.', 'Buy protein in bulk.'],
        },
        'low-carb-premium': {
            breakfast: ['Smoked salmon and cream cheese', 'Steak and eggs', 'High-quality yogurt with nuts'],
            lunch: ['Seafood/Prawn Salad', 'Gourmet burger (no bun) with salad', 'Duck breast with broccoli'],
            dinner: ['Aged steak with mushroom sauce', 'Grilled lobster with butter', 'Moroccan spiced lamb stew'],
            tips: ['Focus on quality fats (avocado oil).', 'Source organic meats.', 'Use premium spices like saffron.'],
        },
    };

    get mealOptions(): { [key: string]: { breakfast: string[], lunch: string[], dinner: string[], tips: string[] } } {
        const data = this.coreMealData;
        return {
            ...data,
            'balanced-budget-friendly': data['balanced-moderate'],
            'vegetarian-moderate': data['vegetarian-budget-friendly'],
            'vegetarian-premium': data['vegan-premium'],
            'vegan-budget-friendly': data['vegetarian-budget-friendly'],
            'vegan-moderate': data['vegan-premium'],
        };
    }

    submitPlan() {
        this.mealPlan = null;
        this.isLoading = true;
        this.currentTimestamp = Date.now();

        setTimeout(() => {
            this.generatePlan();
            this.isLoading = false;
        }, 1500);
    }

    generatePlan() {
        const options = this.mealOptions;
        const key = `${this.dietaryPreference}-${this.budgetLevel}`;
        const selectedOptions = options[key] || options['balanced-moderate'];

        const days = parseInt(this.daysToplan);
        this.mealPlan = [];

        for (let i = 0; i < days; i++) {
            this.mealPlan.push({
                breakfast: selectedOptions.breakfast[i % selectedOptions.breakfast.length],
                lunch: selectedOptions.lunch[i % selectedOptions.lunch.length],
                dinner: selectedOptions.dinner[i % selectedOptions.dinner.length],
                tip: selectedOptions.tips[i % selectedOptions.tips.length]
            });
        }

        if (this.targetCuisine && this.mealPlan.length > 0) {
            this.mealPlan[0].tip = `Special Note: Meals for Day 1 were tailored to include elements of ${this.targetCuisine} cuisine.`;
        }
    }

    clearPlan() {
        this.mealPlan = null;
    }

    downloadPlan() {
        alert("Shopping List Downloaded! (Simulated)");
    }
}
