import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './privacy.html',
    styleUrls: ['./privacy.css']
})
export class PrivacyPolicyComponent { }
