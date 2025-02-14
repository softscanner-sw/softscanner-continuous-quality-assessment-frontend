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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CollapsibleGoalPanelsComponent } from './shared/components/collapsible-goal-panels/collapsible-goal-panels.component';
import { GoalAssessmentOverviewComponent } from './shared/components/goal-assessment-overview/goal-assessment-overview.component';
import { GoalDetailsComponent } from './shared/components/goal-details/goal-details.component';
import { MetricDetailsComponent } from './shared/components/metric-details/metric-details.component';
import { MetricsDashboardComponent } from './shared/components/metrics-dashboard/metrics-dashboard.component';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';

/**
 * Main application module that declares and imports all components and services.
 */
@NgModule({
    declarations: [ // Declare all components used in the application
        AppComponent,
        QualityModelComponent,
        MetadataFormComponent,
        ProgressBarComponent,
        MetricsDashboardComponent,
        MetricDetailsComponent,
        GoalDetailsComponent,
        GoalAssessmentOverviewComponent,
        CollapsibleGoalPanelsComponent
    ],
    imports: [
        BrowserModule, // Provides services for running an app in the browser
        FormsModule, // Supports template-driven forms
        AppRoutingModule, // Configures the router with application routes
        HttpClientModule, // Enables HTTP communication with external services
        MatTreeModule, // For rendering tree components
        MatCheckboxModule, // For checkbox components
        MatIconModule, // For icon components
        NgxChartsModule, // For charting capabilities
        MatProgressSpinnerModule // For showing progress spinners
    ],
    providers: [ // Application-level providers
        provideAnimationsAsync() // Asynchronous animation provider for optimized loading
    ],
    bootstrap: [AppComponent], // Bootstraps the `AppComponent` as the root component
})
export class AppModule { }
