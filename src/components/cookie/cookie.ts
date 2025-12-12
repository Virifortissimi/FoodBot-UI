import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cookie-policy',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cookie.html',
    styleUrls: ['./cookie.css']
})
export class CookiePolicyComponent { }
