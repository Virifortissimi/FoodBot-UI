import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListPageComponent } from './pages/shopping-list-page/shopping-list-page.component';

const routes: Routes = [
    { path: '', component: ShoppingListPageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShoppingListModule { }
