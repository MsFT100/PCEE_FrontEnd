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
import { AddFuelComponent } from './add-fuel/add-fuel.component';
import { VehicleSubscriptionComponent } from './vehicle-subscription/vehicle-subscription.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

export const routes: Routes = [
    /*{path: 'vehicle-detail-view/:id',
     loadComponent: () => import('./vehicle-detail-view/vehicle-detail-view.component').then(mod => mod.VehicleDetailViewComponent) },*/
    {path: 'vehicle-detail-view/:id', component: VehicleDetailViewComponent},
    {path: 'add-fuel/:id', component: AddFuelComponent},
    {path: 'add-service/:id', component: AddServiceComponent},
    {path: 'contact-us', component: ContactUsComponent},
    {path: 'subscriptions/:id', component: VehicleSubscriptionComponent},
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

