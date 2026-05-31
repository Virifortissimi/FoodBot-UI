import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeChatPageComponent } from './pages/recipe-chat-page/recipe-chat-page.component';

const routes: Routes = [
  { path: '', component: RecipeChatPageComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeChatRoutingModule { }
