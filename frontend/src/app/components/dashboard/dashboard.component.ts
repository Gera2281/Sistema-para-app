import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { timeout } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Cliente, ClientesService} from '../../services/clientes.service';
import { AgregarClienteModalComponent } from '../agregar-cliente-modal/agregar-cliente-modal';
import { EliminarClienteModalComponent } from '../eliminar-cliente/eliminar-cliente';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AgregarClienteModalComponent, EliminarClienteModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario$;
  clientes: Cliente[] = [];
  cargandoClientes = true;
  errorClientes = '';
  isModalVisible = false;
  isDeleteModalVisible = false;
  clienteSeleccionado: Cliente = { id: 0, nombre: '', correo: '', rol: '', telefono: '', estado: 'Activo' };

  closeDeleteModal() {
    this.isDeleteModalVisible = false;
  }

  openDeleteModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.isDeleteModalVisible = true;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private clientesService: ClientesService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.usuario$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargandoClientes = true;
    this.errorClientes = '';

    const tiempoMaximoCarga = window.setTimeout(() => {
      if (this.cargandoClientes) {
        this.cargandoClientes = false;
        this.errorClientes = 'La API de clientes no respondió en 8 segundos. Confirma que backend y MySQL estén activos.';
        this.changeDetector.detectChanges();
      }
    }, 8000);

    this.clientesService.obtenerClientes().pipe(timeout(8000)).subscribe({
      next: (clientes) => {
        window.clearTimeout(tiempoMaximoCarga);
        this.clientes = clientes;
        this.cargandoClientes = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        window.clearTimeout(tiempoMaximoCarga);
        this.cargandoClientes = false;
        this.errorClientes = error.name === 'TimeoutError'
          ? 'La API tardó demasiado en responder. Verifica que el backend esté activo.'
          : error.error?.error || 'No se pudieron cargar los clientes.';
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

  onSaveCliente(nuevoCliente: Cliente): void {
    this.clientesService.crearCliente(nuevoCliente).subscribe({
      next: (clienteCreado) => {
        console.log('Cliente creado con exito:', clienteCreado);
        this.clientes.unshift(clienteCreado); // Añadir el nuevo cliente al inicio de la lista y actualizar la vista 
        this.closeModal();
        this.changeDetector.detectChanges(); // Forzar la detección de cambios para actualizar la vista 
      },
      error: (error) => {
        console.error('Error al guardar cliente:', error);
        this.closeModal();
      }
    });
  }

  onDeleteCliente(cliente: Cliente): void {
    console.log('DashboardComponent: onDeleteCliente received', cliente);
      this.clientesService.borrarCliente(cliente).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.id !== cliente.id);
          this.closeDeleteModal();
          this.changeDetector.detectChanges();
          console.log('Cliente eliminado con éxito');
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
        }
      });
    }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

