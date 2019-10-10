import { MyAuthConfig } from './auth.config';
import { SignupComponent } from './shared/components/signup/signup.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastyModule } from 'ng2-toasty';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { Ng2UiAuthModule, CustomConfig } from 'ng2-ui-auth';

import { reducer } from './app.reducer';

import { routes } from './app.routes';
import { AppComponent } from './app.component';
import {HttpService } from '../app/project-new/services/http.service';
// adding rx operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { StripeOauthRedirectComponent } from './stripe-oauth-redirect/stripe-oauth-redirect.component';
// import { ComponentsComponent } from './project-new/components/components.component';
// import { CreateProjectComponent } from './create-project/create-project.component';
import { CreatenewprojectComponent } from './project-new/components/createnewproject/createnewproject.component';
import { HttpClientModule } from '@angular/common/http';
// import { ProjectCreateComponent } from './project/components/project-create/project-create.component';
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    LoginComponent,
    SignupComponent,
    StripeOauthRedirectComponent,
    CreatenewprojectComponent,
    // ProjectCreateComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ModalModule.forRoot(),
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    Ng2UiAuthModule.forRoot(MyAuthConfig),
    StoreModule.provideStore(reducer),
    // StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentStore({
      maxAge: 5
    }),
    CoreModule,
    LayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    SharedModule,
    HttpModule,
    ToastyModule.forRoot(),
    HttpClientModule
  ],
  providers: [ HttpService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
