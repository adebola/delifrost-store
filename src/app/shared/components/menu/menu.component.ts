import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

   public menuToggle = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  mainMenuToggle(): void {
    this.menuToggle = !this.menuToggle;
  }
}
