import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// Application routes
const routes: Routes = [
    { path: '', component: AppComponent } // Default route that loads the `AppComponent`
];

// A class to manage application routing.
@NgModule({
    imports: [RouterModule.forRoot(routes)], // Configure the router with the defined routes
    exports: [RouterModule] // Make the `RouterModule` available throughout the app
})
export class AppRoutingModule { }
