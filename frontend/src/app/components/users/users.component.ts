import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsuarioListado, UsuariosService } from '../../services/usuarios.service';
import { AgregarClienteModalComponent } from '../agregar-cliente-modal/agregar-cliente-modal';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, AgregarClienteModalComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  usuario$;
  usuarios: UsuarioListado[] = [];
  cargandoUsuarios = true;
  errorUsuarios = '';
  isModalVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuariosService: UsuariosService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.usuario$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.errorUsuarios = '';

    const tiempoMaximoCarga = window.setTimeout(() => {
      if (this.cargandoUsuarios) {
        this.cargandoUsuarios = false;
        this.errorUsuarios = 'La API de usuarios no respondió en 8 segundos. Confirma que backend y MySQL estén activos.';
        this.changeDetector.detectChanges();
      }
    }, 8000);

    this.usuariosService.obtenerUsuarios().pipe(timeout(8000)).subscribe({
      next: (usuarios) => {
        window.clearTimeout(tiempoMaximoCarga);
        this.usuarios = usuarios;
        this.cargandoUsuarios = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        window.clearTimeout(tiempoMaximoCarga);
        this.cargandoUsuarios = false;
        this.errorUsuarios = error.name === 'TimeoutError'
          ? 'La API tardó demasiado en responder. Verifica que el backend esté activo.'
          : error.error?.error || 'No se pudieron cargar los usuarios.';
        this.changeDetector.detectChanges();
      }
    });
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  onSaveUsuario(nuevoUsuario: UsuarioListado): void {
    this.usuariosService.crearUsuario(nuevoUsuario).subscribe({
      next: (usuarioCreado) => {
        console.log('Usuario creado con exito:', usuarioCreado);
        this.usuarios.unshift(usuarioCreado); // Añadir el nuevo usuario al inicio de la lista y actualizar la vista 
        this.closeModal();
        this.changeDetector.detectChanges(); // Forzar la detección de cambios para actualizar la vista 
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
        this.closeModal();
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

