import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../services/clientes.service';

@Component({
  selector: 'app-eliminar-cliente-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-cliente.html',
  styleUrls: ['./eliminar-cliente.css']
})
export class EliminarClienteModalComponent {
  @Input() visible: boolean = false;
  @Input() cliente: Cliente = {
    id: 0,
    nombre: 'John Doe',
    correo: 'john.doe@example.com',
    rol: 'Residente',
    telefono: '123-456-7890',
    estado: 'Activo'
  };
  @Output() close = new EventEmitter<void>();
  @Output() deleteConfirmed = new EventEmitter<any>();

  onClose(): void {
    this.close.emit();
  }

  confirmDelete(): void {
    console.log('EliminarClienteModalComponent: confirmDelete emit', this.cliente);
    this.deleteConfirmed.emit(this.cliente);
  }

}
