import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children: [
            {
                path: '', loadComponent: () => import('./feature/home/home.component').then(component => component.HomeComponent)
            },
            {
                path: 'relatorios', loadComponent: () => import('./feature/relatorios/relatorios.component').then(component => component.RelatoriosComponent)
            },
            {
                path: 'alugueis', loadComponent: () => import('./feature/alugueis/alugueis.component').then(component => component.AlugueisComponent)
            }
        ]
    }
];
