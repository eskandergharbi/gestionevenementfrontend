
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this module
import { RouterModule } from '@angular/router';
import { MFE1_ROUTES } from './app/components/member-routing.module';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(),
    importProvidersFrom(HttpClientModule), // Add this line
	importProvidersFrom(BrowserAnimationsModule), // Add this line
  importProvidersFrom(RouterModule.forRoot(MFE1_ROUTES))

  ],
}).catch((err: any) => console.error(err));
