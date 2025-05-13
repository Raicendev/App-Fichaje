import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css']
})
export class VacationsComponent implements OnInit {
  solicitudes: any[] = [];
  mostrarFormulario = false;
  tipoSeleccionado: string = 'vacaciones';
  nuevaSolicitud: any = {
    id: null,
    rest_type: '',
    start_date: '',
    end_date: '',
    comment: ''
  };
  archivoAdjunto: File | null = null;
  userRole: string = '';
  userDni: string = '';
  errores: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role;
    this.userDni = user.dni;
    this.obtenerSolicitudes();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetFormulario();
    }
  }

  handleArchivo(event: any): void {
    this.archivoAdjunto = event.target.files[0];
  }

  validarFormulario(): boolean {
    this.errores = [];
    if (!this.tipoSeleccionado) this.errores.push('Debe seleccionar un tipo de solicitud.');
    if (!this.nuevaSolicitud.start_date) this.errores.push('Debe indicar una fecha de inicio.');
    if (this.tipoSeleccionado === 'vacaciones' && !this.nuevaSolicitud.end_date) this.errores.push('Debe indicar una fecha de fin.');
    return this.errores.length === 0;
  }

  enviarSolicitud(): void {
    if (!this.validarFormulario()) return;

    const formData = new FormData();
    formData.append('user_DNI', this.userDni);
    formData.append('rest_type', this.tipoSeleccionado);
    formData.append('start_date', this.nuevaSolicitud.start_date);
    if (this.nuevaSolicitud.end_date) formData.append('end_date', this.nuevaSolicitud.end_date);
    if (this.nuevaSolicitud.comment) formData.append('comment', this.nuevaSolicitud.comment);
    if (this.archivoAdjunto) formData.append('document', this.archivoAdjunto);

    const esAdmin = this.userRole === 'Administrador' || this.userRole === 'Supervisor';

    if (this.nuevaSolicitud.id) {
      // Edición de solicitud existente
      const estado = esAdmin ? 'approved' : 'pending';
      formData.append('status', estado);
      if (esAdmin) {
        formData.append('reviewed_by', this.userDni);
        formData.append('review_date', new Date().toISOString().split('T')[0]);
      }

      this.http.post(`https://api.fichajes.everybind.com/api/leave-requests/${this.nuevaSolicitud.id}/update`, formData)
        .subscribe(() => {
          this.obtenerSolicitudes();
          this.toggleFormulario();
        });
    } else {
      // Nueva solicitud
      formData.append('status', 'pending');
      this.http.post('https://api.fichajes.everybind.com/api/leave-requests', formData)
        .subscribe(() => {
          this.obtenerSolicitudes();
          this.toggleFormulario();
        });
    }
  }

  aprobarSolicitud(id: number): void {
    this.http.patch(`https://api.fichajes.everybind.com/api/leave-requests/${id}`, {
      status: 'approved',
      reviewed_by: this.userDni,
      review_date: new Date().toISOString().split('T')[0]
    }).subscribe(() => this.obtenerSolicitudes());
  }

  denegarSolicitud(id: number): void {
    this.http.patch(`https://api.fichajes.everybind.com/api/leave-requests/${id}`, {
      status: 'denied',
      reviewed_by: this.userDni,
      review_date: new Date().toISOString().split('T')[0]
    }).subscribe(() => this.obtenerSolicitudes());
  }

  editarSolicitud(solicitud: any): void {
    this.tipoSeleccionado = solicitud.rest_type;
    this.nuevaSolicitud = {
      id: solicitud.id,
      start_date: solicitud.start_date,
      end_date: solicitud.end_date,
      comment: solicitud.comment,
      rest_type: solicitud.rest_type
    };
    this.archivoAdjunto = null;
    this.mostrarFormulario = true;
  }

  obtenerSolicitudes(): void {
    this.http.get<any[]>('https://api.fichajes.everybind.com/api/leave-requests')
      .subscribe(data => {
        this.solicitudes = data.sort((a, b) => b.id - a.id);
      });
  }

  resetFormulario(): void {
    this.nuevaSolicitud = {
      id: null,
      rest_type: '',
      start_date: '',
      end_date: '',
      comment: ''
    };
    this.archivoAdjunto = null;
    this.errores = [];
    this.tipoSeleccionado = 'vacaciones';
  }
}
