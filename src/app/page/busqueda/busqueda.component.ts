import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { Company } from '../../models/company';

@Component({
  selector: 'app-busqueda',
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent implements OnInit, OnDestroy {
  public campoBusqueda: string;
  public messageError: string;
  public listaResultadosCompleta: Company[];
  public listaResultadosPaginada: Company[];
  public elementosPorPagina: number = 5;
  public paginaActual: number = 1;
  public totalPaginas: number = 0;
  public listaCentros: Company[];
  public usuarioLogueado: any;
  public rol: any;


  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router) {
    this.campoBusqueda = '';
    this.messageError = '';
    this.listaResultadosCompleta = [];
    this.listaResultadosPaginada = [];
    this.usuarioLogueado = 'admin';
    this.rol = '';
    this.listaCentros = [
      new Company(1, 'Empresa A', 'C/ Pintor, 18', 'Córdoba', '14147', 'España'),
      new Company(2, 'Empresa B', 'C/ Poeta, 118', 'Córdoba', '14258', 'España'),
      new Company(3, 'Empresa C', 'C/ Cordoba, 28', 'Córdoba', '14015', 'España'),
      new Company(4, 'Empresa D', 'C/ Federico García Lorca, 12', 'Córdoba', '14845', 'España'),
      new Company(5, 'Empresa E', 'C/ Poetas Muertos, 58', 'Madrid', '10001', 'España'),
      new Company(6, 'Empresa F', 'C/ Torquemada, 18', 'Toledo', '16085', 'España'),
      new Company(7, 'Empresa G', 'C/ Pintor, 18', 'Córdoba', '14005', 'España'),
      new Company(8, 'Empresa H', 'C/ Pintor, 18', 'Córdoba', '14005', 'España'),
      new Company(9, 'Empresa I', 'C/ Pintor, 18', 'Córdoba', '14005', 'España'),
      new Company(10, 'Empresa J', 'C/ Pintor, 18', 'Córdoba', '14005', 'España'),
    ];
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'fondoBusqueda');

    // Realizamos la petición GET a la API para obtener los centros
    const url = 'http://localhost:8000/centers/index';
    this.http.get<any[]>(url).pipe(
      tap((respuesta) => {
        this.listaResultadosCompleta = respuesta;
        console.log('Datos recibidos:', this.listaResultadosCompleta);
      }),
      catchError((error) => {
        console.error('Error en la petición GET:', error);
        return of([]); // Devuelve un array vacío como fallback
      })
    ).subscribe();

    // Recuperar datos del usuario desde localStorage
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        this.usuarioLogueado = JSON.parse(userDataString);
        console.log('Datos del usuario logueado en Busqueda:', this.usuarioLogueado);
        // Ahora puedes usar this.usuarioLogueado en tu componente
        // Por ejemplo, podrías mostrar su nombre en la plantilla:
        // <h1>Bienvenido, {{ usuarioLogueado.name }}</h1>
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
        // Manejar el error si los datos en localStorage no son un JSON válido
        // Podrías redirigir al login si los datos son inválidos o no existen
        this.router.navigate(['/login']);
      }
    } else {
      // Si no hay datos del usuario en localStorage, redirigir al login
      console.warn('No se encontraron datos del usuario en localStorage.');
      this.router.navigate(['/login']);
    }

    // Realizamos la petición Get a la API para obtener el nombre del rol
    const urlRol = 'http://localhost:8000/roles/' + this.usuarioLogueado.role_id;
    this.http.get<RoleResponse>(urlRol).pipe(
      tap((respuesta) => {
        this.rol = respuesta.role_name;
        console.log('Datos recibidos:', this.rol);
      }),
      catchError((error) => {
        console.error('Error en la petición GET:', error);
        return of([]); // Devuelve un array vacío como fallback
      })
    ).subscribe();


  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'fondoBusqueda');
  }


  busqueda(campoBusqueda: string) {

    // Validar si el campo es una cadena vacía y recoger la búsqueda
    let esVacio: boolean = campoBusqueda.trim() == '';
    if (esVacio) {
      return;
    }

    //Levantamos el contenedor oculto
    let contenedor = document.getElementById('resultado');
    let contenedorBusqueda = document.getElementById('contenedorBusqueda');
    contenedorBusqueda?.classList.add('oculto');
    contenedor?.classList.remove('oculto');

    // Limpiamos el campo de búsqueda, mensaje de error y la lista de resultados
    this.listaResultadosCompleta = [];
    this.listaResultadosPaginada = [];
    this.campoBusqueda = '';
    this.messageError = '';
    this.paginaActual = 1;

    // Validar si el campo de búsqueda es un número entero y recoger la búsqueda
    let esEntero: boolean = Number.isInteger(Number(campoBusqueda));
    if (esEntero) {
      this.listaResultadosCompleta = this.listaCentros.filter(center => center.id == Number(campoBusqueda));
    } else {
      // Recogemos todos los centros que contengan en su nombre el campo de búsqueda
      this.listaResultadosCompleta = this.listaCentros.filter(center => center.center_name.toLowerCase().includes(campoBusqueda.toLowerCase()));
    }

    if (this.listaResultadosCompleta.length == 0) {
      // Si no se encuentra nada, mostramos un mensaje de error
      this.messageError = 'No se encontraron resultados para la búsqueda ' + campoBusqueda + '.';
      return;
    }

    this.totalPaginas = Math.ceil(this.listaResultadosCompleta.length / this.elementosPorPagina);
    this.cargarPagina();
    console.log('Resultados completos:', this.listaResultadosCompleta);
  }

  cargarPagina() {
    const indiceInicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const indiceFin = indiceInicio + this.elementosPorPagina;
    this.listaResultadosPaginada = this.listaResultadosCompleta.slice(indiceInicio, indiceFin);
    console.log('Página actual:', this.paginaActual, 'Resultados paginados:', this.listaResultadosPaginada);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarPagina();
    }
  }

  mostrarBusqueda() {
    let contenedorResultado = document.getElementById('resultado');
    let contenedorBusqueda = document.getElementById('contenedorBusqueda');
    contenedorResultado?.classList.add('oculto');
    contenedorBusqueda?.classList.remove('oculto');
    this.listaResultadosCompleta = [];
    this.listaResultadosPaginada = [];
    this.paginaActual = 1;
    this.totalPaginas = 0;
  }

  get paginas(): number[] {
    const paginasAMostrar = 3; // Número de páginas a mostrar alrededor de la actual
    const mitad = Math.floor(paginasAMostrar / 2);
    let inicio = Math.max(1, this.paginaActual - mitad);
    let fin = Math.min(this.totalPaginas, inicio + paginasAMostrar - 1);
  
    // Ajustar el inicio si el final está cerca del total
    if (fin - inicio < paginasAMostrar - 1 && fin === this.totalPaginas) {
      inicio = Math.max(1, fin - paginasAMostrar + 1);
    }
  
    return Array.from({ length: (fin - inicio + 1) }, (_, i) => inicio + i);
  }

  asignarCentro(id: number){}

}

interface RoleResponse {
  role_name: string;
}
