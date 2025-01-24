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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MetricsDashboardComponent } from './shared/components/metrics-dashboard/metrics-dashboard.component';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        QualityModelComponent,
        MetadataFormComponent,
        ProgressBarComponent,
        MetricsDashboardComponent
    ],
    imports: [
        BrowserModule, 
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatTreeModule,
        MatCheckboxModule,
        MatIconModule,
        NgxChartsModule,
        MatProgressSpinnerModule
    ],
    providers: [
    provideAnimationsAsync()
  ],
    bootstrap: [AppComponent],
})
export class AppModule { }
