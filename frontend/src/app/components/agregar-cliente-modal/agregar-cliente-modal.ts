import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-cliente-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agregar-cliente-modal.html',
  styleUrls: ['./agregar-cliente-modal.css']
})
export class AgregarClienteModalComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  cliente = {
    nombre: '',
    correo: '',
    telefono: '',
    rol: 'residente'
  };

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit(this.cliente);
  }

}
