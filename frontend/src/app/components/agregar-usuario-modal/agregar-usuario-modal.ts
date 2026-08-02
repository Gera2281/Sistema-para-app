import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-usuario-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agregar-usuario-modal.html',
  styleUrls: ['./agregar-usuario-modal.css']
})
export class AgregarUsuarioModalComponent {
  @Input() visible: boolean = false;
  @Input() errorGuardar = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  usuario = {
    nombre: '',
    correo: '',
    telefono: '',
    rol: 'residente',
    contrasena: ''
  };

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit(this.usuario);
  }

}
