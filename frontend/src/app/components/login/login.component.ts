import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ForgotPasswordModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  nombre = '';
  passwordConfirmacion = '';
  mostrarFormularioRegistro = false;
  mostrarContrasena = false;
  cargando = false;
  error = '';
  showForgotPasswordModal = false;

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion(): void {
    if (!this.correo || !this.contrasena) {
      this.error = 'Completa correo y contraseña.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.error || 'No se pudo iniciar sesión.';
      }
    });
  }

  forgotPassword(): void {
    this.showForgotPasswordModal = true;
  }

  registrarUsuario(): void {
    if (!this.nombre || !this.correo || !this.contrasena || !this.passwordConfirmacion) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.contrasena !== this.passwordConfirmacion) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.registrar(this.nombre, this.correo, this.contrasena).subscribe({
      next: () => {
        this.cargando = false;
        this.error = '';
        this.mostrarFormularioRegistro = false;
        alert('Registro correcto. Ahora puedes iniciar sesión.');
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.error || 'No se pudo crear la cuenta.';
      }
    });
  }

  alternarFormulario(): void {
    this.mostrarFormularioRegistro = !this.mostrarFormularioRegistro;
    this.error = '';
    this.correo = '';
    this.contrasena = '';
    this.nombre = '';
    this.passwordConfirmacion = '';
    this.mostrarContrasena = false;
  }

  alternarVisibilidadContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
