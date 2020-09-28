import { BlogPageComponent } from './blog-page/blog-page.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
      path: '',
      component: BlogPageComponent
    },
    {
      path: 'details',
      component: BlogDetailsComponent
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogRoutingModule {}
