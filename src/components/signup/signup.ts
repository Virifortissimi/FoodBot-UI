import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './signup.html',
    styleUrls: ['./signup.css']
})
export class SignupComponent implements OnInit {
    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    loading = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }

    async onSubmit() {
        if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
            this.error = 'Please fill in all fields';
            return;
        }

        if (this.password.length < 8) {
            this.error = 'Password must be at least 8 characters';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
        }

        this.error = '';
        this.loading = true;

        const result = await this.authService.signUp(this.email, this.password, this.fullName);

        if (result.success) {
            this.router.navigate(['/login']);
        } else {
            this.error = result.error || 'Sign up failed';
            this.loading = false;
        }
    }
}
