import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

   private authSubscription: Subscription;
   isLoggedIn = false;
   fullName: string = null;
   public menuToggle = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = null;
      this.isLoggedIn = false;
    }
  }

  ngOnInit(): void {

    this.authSubscription = this.authService.user.subscribe((user: User) => {

      if (user && user.token) {
        this.isLoggedIn = true;
        this.fullName = user.fullName;
      }
    });
  }

  onLogout() {

    this.authService.logout();
    this.isLoggedIn = false;
    this.fullName = null;
    this.router.navigate(['/shop/collection']);
  }

  mainMenuToggle(): void {
    this.menuToggle = !this.menuToggle;
  }

  // // Click Toggle menu (Mobile)
  // toggleNavActive(item: { active: boolean; }) {
  //   item.active = !item.active;
  // }

}
