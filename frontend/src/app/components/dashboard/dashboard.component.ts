import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsuarioListado, UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario$;
  usuarios: UsuarioListado[] = [];
  cargandoUsuarios = true;
  errorUsuarios = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuariosService: UsuariosService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.usuario$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    const tiempoMaximoCarga = window.setTimeout(() => {
      if (this.cargandoUsuarios) {
        this.cargandoUsuarios = false;
        this.errorUsuarios = 'La API no respondió en 8 segundos. Confirma que backend y MySQL estén activos.';
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

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
