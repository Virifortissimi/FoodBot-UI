import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MealPlannerRoutingModule } from './meal-planner-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DragDropModule,
    MealPlannerRoutingModule
  ]
})
export class MealPlannerModule { }
