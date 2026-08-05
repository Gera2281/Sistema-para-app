import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.html',
  styleUrls: ['./forgot-password-modal.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ForgotPasswordModalComponent {
  email: string = '';
  @Output() closeModal = new EventEmitter<void>();

  constructor(private passwordResetService: PasswordResetService) { }

  onSubmit() {
    this.passwordResetService.requestPasswordReset(this.email).subscribe(
      () => {
        console.log('Password reset email sent');
        this.close();
      },
      (error) => {
        console.error('Error sending password reset email:', error);
      }
    );
  }

  close() {
    this.closeModal.emit();
  }
}
