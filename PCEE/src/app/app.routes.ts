import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { VehicleDetailViewComponent } from './vehicle-detail-view/vehicle-detail-view.component';

export const routes: Routes = [
    {path: 'vehicle-detail-view', component: VehicleDetailViewComponent },
    {path: 'home', component:WelcomePageComponent},
    {path: 'signin', component: SigninComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'vehicle', component: VehicleComponent},
    {path: 'add-vehicle', component: VehicleFormComponent},
    {path: 'settings', component: AccountSettingsComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent}
];

