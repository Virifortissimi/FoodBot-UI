import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlannerDashboardComponent } from './pages/planner-dashboard/planner-dashboard.component';

const routes: Routes = [
  { path: '', component: PlannerDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealPlannerRoutingModule { }
