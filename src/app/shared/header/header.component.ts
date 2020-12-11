import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() class: string;
  @Input() themeLogo = 'assets/images/icon/logo-7.png'; // Default Logo
  @Input() topbar = true; // Default True
  @Input() sticky = false; // Default false

  public stick = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  // @HostListener Decorator
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (value >= 300 && window.innerWidth > 400) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }
}
