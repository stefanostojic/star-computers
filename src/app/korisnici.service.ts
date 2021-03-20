import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Korisnik } from './korisnik.model';
import { Subject } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({ providedIn: 'root' })
export class KorisniciService {
  private korisnici: Korisnik[] = [];
  private korisniciUpdated = new Subject<Korisnik[]>();
  private korisnikUpdated = new Subject<Korisnik>();
  private greskaStatus = new Subject<{ tip: string, status: boolean }>();

  constructor(private http: HttpClient) {}

  getKorisniciUpdateListener() {
    return this.korisniciUpdated.asObservable();
  }

  getKorisnikUpdateListener() {
    return this.korisnikUpdated.asObservable();
  }

  getGreskaStatusUpdateListener() {
    return this.greskaStatus.asObservable();
  }

  getKorisnici() {
    console.log('korisnici.service: getKorisnici(): ...');
    this.http.get<{ korisnici: any }>('http://localhost:3000/api/korisnici/')
    .subscribe(data => {
      this.korisnici = data.korisnici;
      this.korisniciUpdated.next([...this.korisnici]);
      console.log('korisnici.service: getKorisnici(): gotovo');
    });
  }

  getKorisnik(id: string) {
    this.http.get<Korisnik>('http://localhost:3000/api/korisnici/' + id)
    .subscribe(korisnik => {
      this.korisnikUpdated.next(korisnik);
    },
    error => {
      console.log('oops', error);
    });
  }

  updateKorisnik(
    idParam: string,
    emailParam: string,
    imeParam: string,
    prezimeParam: string,
    telefonParam: string,
    gradParam: string,
    ulicaParam: string,
    postanskiBrojParam: number
  ) {
    const korisnik: Korisnik = {
      _id: idParam,
      email: emailParam,
      ime: imeParam,
      prezime: prezimeParam,
      telefon: telefonParam,
      grad: gradParam,
      ulica: ulicaParam,
      postanskiBroj: postanskiBrojParam
    };
    console.log('korisnici.service: updateKorisnik(): ' + korisnik);
    this.http.put('http://localhost:3000/api/korisnici/' + idParam, korisnik)
    .subscribe(response => {
      console.log('korisnici.service: updateKorisnik() successful');
      const updatedKorisnici = [...this.korisnici];
      const oldKorisnikIndex = updatedKorisnici.findIndex(p => p._id === idParam);
      updatedKorisnici[oldKorisnikIndex] = korisnik;
      this.korisnici = updatedKorisnici;
      this.korisniciUpdated.next([...this.korisnici]);
      this.korisnikUpdated.next(korisnik);
    }, error => {
      console.log('GRESKA U SERVISU');
      this.greskaStatus.next({
        tip: 'update',
        status: false
      });
    });
  }

  deleteKorisnik(id: string) {
    this.http
      .delete('http://localhost:3000/api/korisnici/' + id)
      .subscribe(() => {
        const updatedKorisnici = this.korisnici.filter(korisnik => korisnik._id !== id);
        this.korisnici = updatedKorisnici;
        this.korisniciUpdated.next([...this.korisnici]);
    });
  }
}
