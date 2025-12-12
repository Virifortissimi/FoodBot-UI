import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-terms-service',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './terms.html',
    styleUrls: ['./terms.css']
})
export class TermsServiceComponent { }
