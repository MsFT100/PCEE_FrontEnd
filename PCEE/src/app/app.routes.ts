import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

export const routes: Routes = [
    {path: '', component:WelcomePageComponent},
    {path: 'signin', component: SigninComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'vehicle', component: VehicleComponent},
    {path: 'settings', component: AccountSettingsComponent},
    //{path: '', redirectTo: '/signin', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent}
];

