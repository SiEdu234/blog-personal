import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { HomeContentComponent } from './modules/home/components/home-content/home-content.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'registro', component: RegistroComponent },
    { path: 'home', component: HomeContentComponent },
];
