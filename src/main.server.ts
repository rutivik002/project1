// main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideServerRendering } from '@angular/platform-server';

export default function bootstrap(context: any) {
  return bootstrapApplication(AppComponent, {
    providers: [
      provideServerRendering(),
      provideHttpClient(),
      provideRouter([])
    ],
  }, context);
}
