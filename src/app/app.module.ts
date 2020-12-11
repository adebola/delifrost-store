import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {ToastrModule} from 'ngx-toastr';

import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {ShopComponent} from './shop/shop.component';
import {PagesComponent} from './pages/pages.component';
import {AuthInterceptorService} from './auth/auth-interceptor.service';

import 'hammerjs';
import 'mousetrap';
import {AuthComponent} from './auth/auth.component';

@NgModule({
    declarations:
        [
            AppComponent,
            ShopComponent,
            PagesComponent,
            AuthComponent
        ],
    imports:
        [
            BrowserAnimationsModule,
            HttpClientModule,
            NgbModule,
            LoadingBarHttpClientModule,
            LoadingBarRouterModule,
            ToastrModule.forRoot({
                timeOut: 3000,
                progressBar: false,
                enableHtml: true,
            }),
            SharedModule,
            AppRoutingModule
        ],
    providers:
        [
            {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
