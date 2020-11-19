import { BlogPageComponent } from './blog-page/blog-page.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
  {
      path: '',
      component: BlogPageComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'details',
      component: BlogDetailsComponent,
      canActivate: [AuthGuard]
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogRoutingModule {}
