import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { QualityModelComponent } from './components/quality-model/quality-model.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
    declarations: [
        AppComponent,
        QualityModelComponent,
        MetadataFormComponent
    ],
    imports: [
        BrowserModule, 
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatTreeModule,
        MatCheckboxModule,
        MatIconModule
    ],
    providers: [
    provideAnimationsAsync()
  ],
    bootstrap: [AppComponent],
})
export class AppModule { }
