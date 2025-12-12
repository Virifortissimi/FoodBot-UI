import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';
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
        if (!this.email || !this.password) {
            this.error = 'Please fill in all fields';
            return;
        }

        this.error = '';
        this.loading = true;

        const result = await this.authService.signIn(this.email, this.password);

        if (result.success) {
            this.router.navigate(['/']);
        } else {
            this.error = result.error || 'Sign in failed';
            this.loading = false;
        }
    }
}
