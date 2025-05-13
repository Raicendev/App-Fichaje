import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    // Obtenemos las instancias necesarias
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    
    // Espiamos el método navigate del router
    spyOn(router, 'navigate');
  });

  it('debería crearse correctamente', () => {
    expect(guard).toBeTruthy();
  });

  it('debería permitir acceso cuando el usuario está logueado', () => {
    // Simulamos que el usuario está logueado
    spyOn(localStorage, 'getItem').and.returnValue('true');
    
    expect(guard.canActivate()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('debería denegar acceso y redirigir cuando el usuario no está logueado', () => {
    // Simulamos que el usuario NO está logueado
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar valores no booleanos en localStorage', () => {
    // Caso edge: localStorage devuelve un string no esperado
    spyOn(localStorage, 'getItem').and.returnValue('invalid');
    
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});