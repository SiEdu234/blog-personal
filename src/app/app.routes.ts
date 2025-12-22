import { Routes } from '@angular/router';
import { HomeContentComponent } from './modules/home/components/home-content/home-content.component';
import { FormContentComponent } from './modules/form/components/form-content/form-content.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeContentComponent },
    { path: 'form', component: FormContentComponent },
    { path: 'form/:id', component: FormContentComponent }
];
