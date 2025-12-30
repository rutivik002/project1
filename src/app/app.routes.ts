import { Component } from '@angular/core';

import { provideRouter, RouterModule,  } from '@angular/router';
import { Routes } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CitiesComponent } from './cities/cities';
import { DepartmentComponent } from './department/department';
import { HomeComponent } from './homepage/homepage';
import { DocumentComponent } from './document/document';

export const routes: Routes = [
  { path: '', component: HomeComponent },   // 👈 Main Page
  { path: 'department', component: DepartmentComponent },
  { path: 'cities', component: CitiesComponent },
  { path: 'document', component: DocumentComponent},
  { path: '**', redirectTo: '/' }  // fallback
];

bootstrapApplication(HomeComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
}).catch(err => console.error(err));
