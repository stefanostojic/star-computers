import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth.model';
import { ObavestenjeService } from './obavestenje.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private korisnikId: string;
  private authStatusListener = new Subject<{ isAuthenticated: boolean, isAdmin: boolean }>();
  errorStatus = new Subject<{ message: string }>();

  private isAdmin = false;

  constructor(private http: HttpClient, private router: Router, private obavestenjaService: ObavestenjeService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getUserId() {
    return this.korisnikId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getErrorStatusListener() {
    return this.errorStatus.asObservable();
  }

  registracija(
    emailParam: string,
    lozinkaParam: string,
    imeParam: string,
    prezimeParam: string,
    telefonParam: string,
    gradParam: string,
    ulicaParam: string,
    postanskiBrojParam: number
    ) {
    console.log('auth.service: registracija(): ' + emailParam + ', ' + lozinkaParam);
    const authData = {
      email: emailParam,
      lozinka: lozinkaParam,
      ime: imeParam,
      prezime: prezimeParam,
      telefon: telefonParam,
      grad: gradParam,
      ulica: ulicaParam,
      postanskiBroj: postanskiBrojParam,
    };
    this.http.post('http://localhost:3000/api/korisnici/registracija', authData)
      .subscribe(response => {
        console.log(response);
        this.errorStatus.next({
          message: 'korisnik kreiran'
        });
        this.router.navigate(['/prijava']);
      }, error => {
        console.log('auth.service: prijava(): error.error.message: ', error.error.message);
        this.errorStatus.next({
          message: error.error.message
        });
      });
  }

  prijava(emailParam: string, lozinkaParam: string) {
    console.log('auth.service: prijava(): ' + emailParam + ', ' + lozinkaParam);
    const authData: AuthData = {email: emailParam, lozinka: lozinkaParam};
    this.http.post<{ token: string; isticeZa: number, korisnikId: string, isAdmin: boolean }>(
      'http://localhost:3000/api/korisnici/prijava', authData)
      .subscribe(response => {
        console.log('logovanje resposna: ', response);
        const token = response.token;
        this.token = token;
        if (token) {
          const isticeZa = response.isticeZa;
          console.log('Istice za: ' + isticeZa);
          this.setAuthTimer(isticeZa);
          this.isAuthenticated = true;
          this.isAdmin = response.isAdmin;
          console.log('response.isAdmin: ' + response.isAdmin);
          this.korisnikId = response.korisnikId;
          this.authStatusListener.next({ isAuthenticated: true, isAdmin: response.isAdmin });
          const now = new Date();
          const datumIsteka = new Date(now.getTime() + isticeZa * 1000);
          console.log(datumIsteka);
          this.saveAuthData(token, datumIsteka, this.korisnikId, this.isAdmin);
          this.router.navigate(['/']);
        }
      }, error => {
        console.log('auth.service: prijava(): error.error.message: ', error.error.message);
        this.errorStatus.next({
          message: error.error.message
        });
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      console.log('auth.service: autoAuthUser(): authInfo: ' + authInfo);
      return;
    }
    const now = new Date();
    const isticeZa = authInfo.datumIsteka.getTime() - now.getTime();
    if (isticeZa > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      console.log('auth.service: autoAuthUser(): authInfo.isAdmin: ' + authInfo.isAdmin);
      this.isAdmin = authInfo.isAdmin;
      this.korisnikId = authInfo.korisnikId;
      this.setAuthTimer(isticeZa / 1000);
      this.authStatusListener.next({ isAuthenticated: true, isAdmin: this.isAdmin });
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authStatusListener.next({ isAuthenticated: false, isAdmin: false });
    this.korisnikId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    localStorage.removeItem('korpa');
    this.router.navigate(['/']);
  }

  private setAuthTimer(trajanje: number) {
    console.log('Postavljanje tajmera: ' + trajanje);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, trajanje * 1000);
    console.log('Tajmer: ' + trajanje);
  }

  private saveAuthData(token: string, datumIsteka: Date, korisnikId: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', datumIsteka.toISOString());
    localStorage.setItem('korisnikId', korisnikId);
    localStorage.setItem('isAdmin', isAdmin + '');
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('korisnikId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('korpa');
  }

  private getAuthData() {
    const tokenConst = localStorage.getItem('token');
    const datumIsteka = localStorage.getItem('expiration');
    const korisnikIdConst = localStorage.getItem('korisnikId');
    let isAdmin = false;
    if (localStorage.getItem('isAdmin') === 'true') {
      console.log('auth.service: getAuthData(): jeste admin');
      isAdmin = true;
    }
    console.log('auth.service: getAuthData(): tokenConst: ' + tokenConst);
    const datumIstekaDate = new Date(datumIsteka).getTime();
    const trenutnoVreme = new Date().getTime();
    console.log('**************************************');
    console.log('auth.service: getAuthData(): trenutnoVreme: ' + trenutnoVreme);
    console.log('auth.service: getAuthData(): datumIstekaDate: ' + datumIstekaDate);
    if (datumIstekaDate < trenutnoVreme) {
      console.log('token je istekao');
      this.clearAuthData();
      return;
    }

    if (!tokenConst || !datumIsteka) {
      console.log('auth.service: getAuthData(): token vise ne vazi');
      return;
    }
    return {
      token: tokenConst,
      datumIsteka: new Date(datumIsteka),
      korisnikId: korisnikIdConst,
      isAdmin
    };
  }
}
