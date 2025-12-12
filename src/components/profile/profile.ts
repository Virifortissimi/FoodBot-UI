import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
    full_name: string;
    email: string;
    profile_picture?: string;
    phone?: string;
    location?: string;
    dietary_preferences: string[];
    health_goals: string[];
    allergies: string[];
    created_at: string;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    activeTab = 'personal';
    isEditingPersonal = false;
    isProfilePublic = false;

    userProfile: UserProfile = {
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+234 812 345 6789',
        location: 'Lagos, Nigeria',
        dietary_preferences: ['Vegetarian', 'Low-carb'],
        health_goals: ['Weight Loss', 'Muscle Gain'],
        allergies: ['Peanuts'],
        created_at: '2024-01-15'
    };

    editProfile: UserProfile = { ...this.userProfile };

    tabs = [
        { id: 'personal', name: 'Personal Info', icon: '👤' },
        { id: 'dietary', name: 'Preferences', icon: '🥗' },
        { id: 'subscription', name: 'Subscription', icon: '💳' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];

    dietaryOptions = ['Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Low-carb', 'Gluten-free', 'Dairy-free', 'Halal'];
    healthGoalOptions = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Heart Health', 'Diabetes Management', 'Energy Boost', 'Better Sleep'];
    allergyOptions = ['Peanuts', 'Shellfish', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Tree Nuts', 'Fish'];

    billingHistory = [
        { description: 'FoodBot Pro - Monthly', date: 'Jan 15, 2024', amount: '$10.00', status: 'Paid' },
        { description: 'FoodBot Pro - Monthly', date: 'Dec 15, 2023', amount: '$10.00', status: 'Paid' },
        { description: 'FoodBot Pro - Monthly', date: 'Nov 15, 2023', amount: '$10.00', status: 'Paid' }
    ];

    notificationSettings = [
        { name: 'Meal Plan Reminders', description: 'Get notified when your weekly plan is ready', enabled: true },
        { name: 'New Feature Updates', description: 'See what\'s new on FoodBot', enabled: true },
        { name: 'Daily Nutrition Tips', description: 'Get healthy tips delivered every morning', enabled: false },
        { name: 'Community Alerts', description: 'When someone replies to your review', enabled: true }
    ];

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        // In a real app, verify auth and load data
    }

    getActiveTabName(): string {
        return this.tabs.find(t => t.id === this.activeTab)?.name || '';
    }

    getTabClass(tabId: string): string {
        const baseClass = 'w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center group';
        return this.activeTab === tabId
            ? `${baseClass} bg-teal-50 text-teal-700 shadow-sm border border-teal-100 font-bold`
            : `${baseClass} text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent`;
    }

    toggleDietaryPreference(preference: string): void {
        const index = this.userProfile.dietary_preferences.indexOf(preference);
        if (index > -1) {
            this.userProfile.dietary_preferences.splice(index, 1);
        } else {
            this.userProfile.dietary_preferences.push(preference);
        }
    }

    toggleHealthGoal(goal: string): void {
        const index = this.userProfile.health_goals.indexOf(goal);
        if (index > -1) {
            this.userProfile.health_goals.splice(index, 1);
        } else {
            this.userProfile.health_goals.push(goal);
        }
    }

    toggleAllergy(allergy: string): void {
        const index = this.userProfile.allergies.indexOf(allergy);
        if (index > -1) {
            this.userProfile.allergies.splice(index, 1);
        } else {
            this.userProfile.allergies.push(allergy);
        }
    }

    savePersonalInfo(): void {
        this.userProfile = { ...this.editProfile };
        this.isEditingPersonal = false;
        // Call service to update
    }
}
