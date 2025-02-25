import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this module
import { RouterModule } from '@angular/router';
import { MFE1_ROUTES } from './app/components/collaboration-routing.module';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(),
    importProvidersFrom(HttpClientModule), // Add this line
	importProvidersFrom(BrowserAnimationsModule), // Add this line
  importProvidersFrom(RouterModule.forRoot(MFE1_ROUTES))

  ],
}).catch(err => console.error(err));
