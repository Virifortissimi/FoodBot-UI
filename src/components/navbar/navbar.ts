import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
    menuOpen = false;
    userMenuOpen = false;
    aiDropdownOpen = false;
    mobileAIDropdownOpen = false;
    user: any = null;
    isLoading = true;

    private dropdownCloseTimer: any;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.authService.authState$.subscribe(state => {
            this.user = state.user;
            this.isLoading = state.loading;
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        // Close other dropdowns when menu toggles
        if (!this.menuOpen) {
            this.mobileAIDropdownOpen = false;
        }
    }

    toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
    }

    openAIDropdown() {
        clearTimeout(this.dropdownCloseTimer);
        this.aiDropdownOpen = true;
    }

    closeAIDropdown() {
        this.dropdownCloseTimer = setTimeout(() => {
            this.aiDropdownOpen = false;
        }, 200);
    }

    toggleMobileAIDropdown() {
        this.mobileAIDropdownOpen = !this.mobileAIDropdownOpen;
    }

    async logout() {
        const result = await this.authService.signOut();
        if (result.success) {
            this.userMenuOpen = false;
            this.menuOpen = false;
            this.router.navigate(['/']);
        }
    }
}
