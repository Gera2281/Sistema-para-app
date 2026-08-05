import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ResetPasswordComponent {
  password = '';
  confirmPassword = '';
  token = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {
    this.token = this.route.snapshot.params['token'];
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.passwordResetService.resetPassword(this.token, this.password).subscribe(
      () => {
        alert('Password has been reset');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error resetting password:', error);
        alert('Error resetting password');
      }
    );
  }
}
