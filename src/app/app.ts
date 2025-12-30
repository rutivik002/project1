// app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './shared/message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,MessageComponent],
  template: ' <app-message></app-message> <router-outlet  ></router-outlet>'
})
export class AppComponent {




}
