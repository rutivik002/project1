import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message$ | async as message"
         class="alert alert-success mb-3">
      {{ message }}
    </div>
  `
})
export class MessageComponent {
  message$: Observable<string>;

  constructor(private messageService: MessageService) {
    this.message$ = this.messageService.message$;
  }
}
