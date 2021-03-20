import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Korisnik } from './korisnik.model';
import { Porudzbina, PorudzbinaSaKorisnikom } from './porudzbina.model';
import { StavkaKorpe } from './stavka-korpe.model';
import { ObavestenjeService } from './obavestenje.service';
import { Obavestenje } from './obavestenje.model';

@Injectable({ providedIn: 'root' })
export class PorudzbinaService {
  private porudzbine: Porudzbina[] = [];
  private porudzbineUpdated = new Subject<{ porudzbine: Porudzbina[], ukupnoPorudzbina: number }>();
  private porudzbinaGet = new Subject<PorudzbinaSaKorisnikom>();
  private stanjePorudzbine = new Subject<{ stanje: string, poruka: string }>();


  constructor(private http: HttpClient, private obavestenjeService: ObavestenjeService) {}

  getPorudzbineUpdateListener() {
    return this.porudzbineUpdated.asObservable();
  }

  getPotvrdaPorudzbineUpdateListener() {
    return this.stanjePorudzbine.asObservable();
  }

  getPorudzbinaGetListener() {
    return this.porudzbinaGet.asObservable();
  }

  getPorudzbine(id: string, obradjenost: string, porudzbinaPoStrani: number, trenutnaStrana: number) {
    let queryParams = `?id=${id}`;
    queryParams += `&obradjenost=${obradjenost}`;
    queryParams += `&porudzbinaPoStrani=${porudzbinaPoStrani}`;
    queryParams += `&trenutnaStrana=${trenutnaStrana}`;
    console.log('porudzbine.service: getPorudzbine(): ...');
    this.http.get<{ porudzbine: Porudzbina[], ukupnoPorudzbina: number }>(
      'http://localhost:3000/api/porudzbine/' + queryParams
    )
    .subscribe(data => {
      this.porudzbineUpdated.next({
        porudzbine: data.porudzbine,
        ukupnoPorudzbina: data.ukupnoPorudzbina
      });
      console.log('porudzbine.service: getPorudzbine(' + id + '): ' + data.ukupnoPorudzbina);
    });
  }

  getPorudzbina(id: string) {
    this.http.get<PorudzbinaSaKorisnikom>('http://localhost:3000/api/porudzbine/' + id)
    .subscribe(data => {
      console.log('porudzbina.service: getPorudzbina(): ', data);
      console.log('porudzbina.service: getPorudzbina(): ', data.korisnik);
      this.porudzbinaGet.next(data);
    });
  }

  addPorudzbina(korpa: StavkaKorpe[], napomena: string) {
    console.log('porudzbina.service: addPorudzbina(): korpa: ' + JSON.stringify(korpa));
    const data = [] as { proizvodId: string, kolicina: number }[];
    for (const stavka of korpa) {
      data.push({proizvodId: stavka.proizvodId, kolicina: stavka.kolicina});
    }
    const paket = { stavke: data, napomena };
    console.log('porudzbina.service: addPorudzbina(): data: ' + JSON.stringify(data));
    this.http.post<{
      message: string,
      nedostupanProizvod: string,
      trazenaKolicina: number,
      dostupnaKolicina: number
    }>('http://localhost:3000/api/porudzbine', paket)
    .subscribe(response => {
      console.log('porudzbina.service: addPorudzbina(): cuvanje porudzbine gotovo');
      if (response.message === 'uspeh') {
        this.stanjePorudzbine.next({
          stanje: 'Uspešno ste napravili porudžbinu!',
          poruka: ''
        });
      } else {
        this.stanjePorudzbine.next({
          // stanje: 'Došlo je do greške prilikom potvrđivanja Vaše porudžbine. Molimo Vas da nam se obratite putem kontakt centra.',
          stanje: 'U porudžbini se zahteva ' + response.trazenaKolicina + ' ' + response.nedostupanProizvod +
          ', ali mi trenutno na stanju imamo samo ' + response.dostupnaKolicina + '.',
          poruka: ''
        });
        console.log('response.message: ' + response.message);
      }
    },
    error => {
      console.log('oops', error);
      this.stanjePorudzbine.next({
        stanje: 'Došlo je do greške prilikom potvrđivanja Vaše porudžbine. Molimo Vas da nam se obratite putem kontakt centra.',
        poruka: ''
      });
    });
  }

  // postavlja porudzbina.obradjena na true
  obradaPorudzbine(porudzbinaId: string, obradjenostStatus: string, id: string, obradjenost: string, porudzbinaPoStrani: number,
                   trenutnaStrana: number) {
    console.log('porudzbina.service: obradaPorudzbine(): ' + porudzbinaId);
    this.http.put('http://localhost:3000/api/porudzbine/' + porudzbinaId, {obradjenost: obradjenostStatus})
    .subscribe(response => {
      console.log('porudzbina.service: obradaPorudzbine(): successful');
      this.getPorudzbine(
        id,
        obradjenost,
        porudzbinaPoStrani,
        trenutnaStrana
      );
    });
  }

  dodajUKorpu(stavka: StavkaKorpe) {
    console.log('porudzbina.service: dodajUKorpu(): ...');

    const korpa = localStorage.getItem('korpa');
    if (korpa) {
      console.log('localStorage.getItem(korpa): ' + korpa);
      const korpaObj: StavkaKorpe[] = JSON.parse(korpa);
      const indexStarogZapisa = korpaObj.findIndex(z => z.proizvodId === stavka.proizvodId);
      console.log('indexStarogZapisa: ' + indexStarogZapisa);
      if (indexStarogZapisa > -1) {
        const stavkaKorpe = korpaObj[indexStarogZapisa];
        stavkaKorpe.kolicina += stavka.kolicina;
        korpaObj[indexStarogZapisa] = stavkaKorpe;
        localStorage.setItem('korpa', JSON.stringify(korpaObj));
      } else {
        korpaObj.push(stavka);
        localStorage.setItem('korpa', JSON.stringify(korpaObj));
      }
    } else {
      console.log('localStorage.getItem(korpa): ' + korpa);
      const korpaObj: { proizvodId: string, kolicina: number }[] = [];
      korpaObj.push(stavka);
      localStorage.setItem('korpa', JSON.stringify(korpaObj));
    }

    console.log('porudzbina.service: dodajUKorpu(): gotovo');
  }

  azurirajKorpu(proizvodId: string, kolicina: number) {
    console.log('porudzbina.service: azurirajKorpu(): ...');

    const korpa = localStorage.getItem('korpa');
    const korpaObj: { proizvodId: string, kolicina: number }[] = JSON.parse(korpa);
    const indexStarogZapisa = korpaObj.findIndex(z => z.proizvodId === proizvodId);
    korpaObj[indexStarogZapisa].kolicina = kolicina;
    localStorage.setItem('korpa', JSON.stringify(korpaObj));

    console.log('porudzbina.service: azurirajKorpu(): gotovo');
  }

  obrisiIzKorpe(proizvodId: string) {
    const korpa = localStorage.getItem('korpa');
    const korpaObj: StavkaKorpe[] = JSON.parse(korpa);
    const novaKorpa = korpaObj.filter(z => z.proizvodId !== proizvodId);
    localStorage.setItem('korpa', JSON.stringify(novaKorpa));
  }

  getPorudzbineZaKorisnika(idKorisnika: string, porudzbinaPoStrani: number, trenutnaStrana: number) {
    let queryParams = `?idKorisnika=${idKorisnika}`;
    queryParams += `&porudzbinaPoStrani=${porudzbinaPoStrani}`;
    queryParams += `&trenutnaStrana=${trenutnaStrana}`;
    console.log('porudzbina.service: getPorudzbineZaKorisnika(): queryParams: ', queryParams);
    this.http.get<{ porudzbine: Porudzbina[], ukupnoPorudzbina: number }>
    ('http://localhost:3000/api/porudzbineZaKorisnika/' + queryParams).subscribe(data => {
      this.porudzbineUpdated.next({
        porudzbine: data.porudzbine,
        ukupnoPorudzbina: data.ukupnoPorudzbina
      });
    });
  }
}
