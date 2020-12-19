import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openDashboard: boolean = true;

  public openAccountInfo = true;
  public openAddress = false;
  public openOrders = false;
  public openWishlist = false;
  public openProfile = false;
  public openChangePassword = false;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
  }

  ToggleDashboard() {
    this.openDashboard = !this.openDashboard;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  onAccountInfo() {

    this.openOrders = false;
    this.openAddress = false;
    this.openWishlist = false;
    this.openProfile = false;
    this.openChangePassword = false;

    this.openAccountInfo = true;
  }

  onMyOrders() {
    this.openAccountInfo = false;
    this.openAddress = false;
    this.openWishlist = false;
    this.openProfile = false;
    this.openChangePassword = false;

    this.openOrders = true;
  }

  onMyWishList() {
    this.openAccountInfo = false;
    this.openAddress = false;
    this.openOrders = false;
    this.openProfile = false;
    this.openChangePassword = false;

    this.openWishlist = true;
  }

  onChangePassword() {
    this.openAccountInfo = false;
    this.openAddress = false;
    this.openOrders = false;
    this.openProfile = false;
    this.openWishlist = false;

    this.openChangePassword = true;
  }

  onMyProfile() {
    this.openChangePassword = false;
    this.openAccountInfo = false;
    this.openAddress = false;
    this.openOrders = false;
    this.openWishlist = false;

    this.openProfile = true;
  }

  onAddress() {
    this.openChangePassword = false;
    this.openAccountInfo = false;
    this.openProfile = false;
    this.openOrders = false;
    this.openWishlist = false;

    this.openAddress = true;

  }
}
