import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eliminar-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-usuario.html',
  styleUrls: ['./eliminar-usuario.css']
})
export class EliminarUsuarioModalComponent {
  @Input() visible: boolean = false;
  @Input() usuario = {
    id: 0,
    nombre: 'John Doe',
    correo: 'john.doe@example.com',
    rol: 'Residente'
  };
  @Output() close = new EventEmitter<void>();
  @Output() deleteConfirmed = new EventEmitter<any>();

  onClose(): void {
    this.close.emit();
  }

  confirmDelete(): void {
    this.deleteConfirmed.emit(this.usuario);
  }

}
