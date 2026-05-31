import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NutritionDashboardComponent } from './pages/nutrition-dashboard/nutrition-dashboard.component';

const routes: Routes = [
  { path: '', component: NutritionDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule { }
