import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  template: `
    @if (open) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="confirm-title" (click)="cancel.emit()">
        <div class="modal-dialog modal-dialog-centered" (click)="$event.stopPropagation()">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header border-0 pb-0">
              <h2 class="modal-title fs-5" id="confirm-title">{{ title }}</h2>
              <button type="button" class="btn-close" aria-label="Close" (click)="cancel.emit()"></button>
            </div>
            <div class="modal-body text-secondary">{{ message }}</div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" (click)="cancel.emit()">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="confirm.emit()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmationDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirm action';
  @Input() message = 'Are you sure?';
  @Output() readonly confirm = new EventEmitter<void>();
  @Output() readonly cancel = new EventEmitter<void>();
}
