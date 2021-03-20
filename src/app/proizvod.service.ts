import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proizvod, ProizvodMin } from './proizvod.model';
import { Karakteristika } from './karakteristika.model';
import { Komentar } from './komentar.model';
import { Subject } from 'rxjs';
import { UpperCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProizvodService {
  private proizvodi: Proizvod[] = [];
  private proizvodiUpdated = new Subject<{ proizvodi: Proizvod[], brojProizvoda: number }>();
  private proizvodiFetching = new Subject<boolean>();
  private proizvodjaciArray = new Subject<string[]>();
  private proizvodDodatIliAzuriran = new Subject<string>();

  id: string;
  naziv: string;
  proizvodjaci: string[];
  kategorija: string;
  cenaMin: number;
  cenaMax: number;
  prodatoMin: number;
  prodatoMax: number;
  kolicinaMin: number;
  kolicinaMax: number;
  sortiranje: string;
  proizvodaPoStrani: number;

  constructor(private http: HttpClient) {}

  addProizvod(
    nazivParam: string, proizvodjacParam: string, slikaParam: File, sazetOpisParam: string, detaljanOpisParam: string, cenaParam: number,
    kolicinaParam: number, prodato: number, kategorijaParam: string, karakteristikeParam: Karakteristika[], komentariParam: Komentar[]) {
    const proizvodData = new FormData();
    proizvodData.append('naziv', nazivParam);
    proizvodData.append('proizvodjac', proizvodjacParam);
    proizvodData.append('sazetOpis', sazetOpisParam);
    proizvodData.append('detaljanOpis', detaljanOpisParam);
    proizvodData.append('cena', cenaParam.toString());
    proizvodData.append('kolicina', kolicinaParam.toString());
    proizvodData.append('prodato', prodato.toString());
    proizvodData.append('kategorija', kategorijaParam);
    proizvodData.append('slika', slikaParam, nazivParam);
    proizvodData.append('karakteristike', JSON.stringify(karakteristikeParam));
    proizvodData.append('komentari', JSON.stringify(komentariParam));
    console.log('proizvod.service: addProizvod(): Slanje proizvoda na server...');
    this.http
      .post<{ proizvod: Proizvod }>(
        'http://localhost:3000/api/proizvodi',
        proizvodData
      )
      .subscribe(responseData => {
        const proizvod: Proizvod = {
          _id: responseData.proizvod._id,
          naziv: nazivParam,
          proizvodjac: proizvodjacParam,
          sazetOpis: sazetOpisParam,
          detaljanOpis: detaljanOpisParam,
          cena: cenaParam,
          kolicina: kolicinaParam,
          prodato,
          kategorija: kategorijaParam,
          slika: responseData.proizvod.slika,
          karakteristike: karakteristikeParam,
          komentari: komentariParam
        };
        // this.proizvodi.push(proizvod);
        // this.proizvodiUpdated.next([...this.proizvodi]);
        this.proizvodDodatIliAzuriran.next('Proizvod uspesno poslat na server');
        console.log('proizvod.service: Proizvod uspesno poslat na server');
      });
  }

  getProizvodi(
    id: string,
    naziv: string,
    proizvodjaci: string[],
    kategorija: string,
    cenaMin: number,
    cenaMax: number,
    kolicinaMin: number,
    kolicinaMax: number,
    prodatoMin: number,
    prodatoMax: number,
    sortiranje: string,
    proizvodaPoStrani: number,
    trenutnaStrana: number
    ) {

    let queryParams = `?`;
    queryParams += `id=${this.id}`;
    queryParams += `&naziv=${this.naziv}`;
    if (proizvodjaci && proizvodjaci.length === 0) {
      queryParams += `&proizvodjaci=${'undefined'}`;
    } else {
      queryParams += `&proizvodjaci=${JSON.stringify(this.proizvodjaci)}`;
    }
    queryParams += `&kategorija=${kategorija}`;
    queryParams += `&cenaMin=${this.cenaMin}`;
    queryParams += `&cenaMax=${this.cenaMax}`;
    queryParams += `&prodatoMin=${this.prodatoMin}`;
    queryParams += `&prodatoMax=${this.prodatoMax}`;
    queryParams += `&kolicinaMin=${this.kolicinaMin}`;
    queryParams += `&kolicinaMax=${this.kolicinaMax}`;
    queryParams += `&sortiranje=${this.sortiranje}`;
    queryParams += `&proizvodaPoStrani=${proizvodaPoStrani}`;
    queryParams += `&trenutnaStrana=${trenutnaStrana}`;

    console.log('proizvod.service: getProizvodi(): queryParams: ', queryParams);

    this.proizvodiFetching.next(true);
    this.http.get<{ proizvodi: Proizvod[], ukupnoProizvoda: number }>(
      'http://localhost:3000/api/proizvodi/' + queryParams
    )
    .subscribe(data => {
      this.proizvodi = data.proizvodi;
      this.proizvodiUpdated.next({
        proizvodi: [...this.proizvodi],
        brojProizvoda: data.ukupnoProizvoda
      });
      this.proizvodiFetching.next(false);
      console.log('proizvod.service: getProizvodi(): gotovo');
    });
  }

  // STRANICA SA JEDNIM PROIZVODOM
  getProizvod(id: string) {
    console.log('prozvod.service: getProizvod(id: string) za indeks: ' + id);
    return this.http.get<Proizvod>('http://localhost:3000/api/proizvodi/' + id);
  }

  getProizvodUpdateListener() {
    return this.proizvodiUpdated.asObservable();
  }

  getProizvodFetchingListener() {
    return this.proizvodiFetching.asObservable();
  }

  getProizvodjaciListener() {
    return this.proizvodjaciArray.asObservable();
  }

  getproizvodDodatIliAzuriranListener() {
    return this.proizvodDodatIliAzuriran.asObservable();
  }


  updateProizvod(
    idParam: string, nazivParam: string, proizvodjac: string, slikaParam: File | string, sazetOpisParam: string, detaljanOpisParam: string,
    cenaParam: number, kolicinaParam: number, prodato: number, kategorijaParam: string, karakteristikeParam: Karakteristika[],
    komentariParam: Komentar[]) {
    let proizvodData: Proizvod | FormData;
    if (typeof slikaParam === 'object') {
      proizvodData = new FormData();
      proizvodData.append('_id', idParam);
      proizvodData.append('naziv', nazivParam);
      proizvodData.append('proizvodjac', proizvodjac);
      proizvodData.append('sazetOpis', sazetOpisParam);
      proizvodData.append('detaljanOpis', detaljanOpisParam);
      proizvodData.append('cena', cenaParam.toString());
      proizvodData.append('kolicina', kolicinaParam.toString());
      proizvodData.append('prodato', prodato.toString());
      proizvodData.append('kategorija', nazivParam);
      proizvodData.append('slika', slikaParam, nazivParam);
      proizvodData.append('karakteristike', JSON.stringify(karakteristikeParam));
      proizvodData.append('komentari', JSON.stringify(komentariParam));
    } else {
      proizvodData = {
        _id: idParam,
        naziv: nazivParam,
        proizvodjac,
        sazetOpis: sazetOpisParam,
        detaljanOpis: detaljanOpisParam,
        cena: cenaParam,
        kolicina: kolicinaParam,
        prodato,
        kategorija: kategorijaParam,
        slika: slikaParam,
        karakteristike: karakteristikeParam,
        komentari: komentariParam
      };
    }
    console.log('proizvod.service: updateProizvod(): ID: ' + idParam);
    console.log('proizvod.service: updateProizvod(): azuriranje proizvoda...');
    this.http.put('http://localhost:3000/api/proizvodi/' + idParam, proizvodData)
    .subscribe(response => {
      console.log('proizvod.service: updateProizvod(): successful');
      this.http.get<Proizvod>('http://localhost:3000/api/proizvodi/' + idParam).subscribe(proizvod => {
        const updatedProizvodi = [...this.proizvodi];
        const oldProizvodIndex = updatedProizvodi.findIndex(p => p._id === idParam);
        updatedProizvodi[oldProizvodIndex] = proizvod;
        this.proizvodi = updatedProizvodi;
        this.proizvodiUpdated.next({
          proizvodi: [...this.proizvodi],
          brojProizvoda: 10
        });
      });
    });
  }

  deleteProizvod(id: string) {
    console.log('proizvod.service: deleteProizvod(): ' + id);
    // this.http
    //   .delete('http://localhost:3000/api/proizvodi/' + id)
    //   .subscribe(() => {
    //     const updatedProizvodi = this.proizvodi.filter(proizvod => proizvod._id !== id);
    //     this.proizvodi = updatedProizvodi;
    //     this.proizvodiUpdated.next([...this.proizvodi]);
    // });
    return this.http.delete('http://localhost:3000/api/proizvodi/' + id);
  }

  addKomentar(idProizvoda: string, komentar: Komentar) {
    console.log('proizvod.service: addKomentar(): ' + JSON.stringify(komentar) + ', ID: ' + idProizvoda);
    this.http.put('http://localhost:3000/api/komentari/' + idProizvoda, komentar)
      .subscribe(data => {
        console.log(data);
      });
  }

  getNajprodavaniji() {
    // console.log('proizvod.service: addKomentar(): ' + JSON.stringify(komentar) + ', ID: ' + idProizvoda);
    this.http.get('http://localhost:3000/api/najprodavaniji/')
      .subscribe(data => {
        console.log(data);
      });
  }

  primeniFilter(
    naziv: string,
    proizvodjaci: string[],
    kategorija: string,
    cenaMin: number,
    cenaMax: number,
    kolicinaMin: number,
    kolicinaMax: number,
    prodatoMin: number,
    prodatoMax: number,
    sortiranje: string,
    proizvodaPoStrani: number
    ) {
    this.naziv = naziv;
    this.proizvodjaci = proizvodjaci;
    this.kategorija = kategorija;
    this.cenaMin = cenaMin;
    this.cenaMax = cenaMax;
    this.kolicinaMin = kolicinaMin;
    this.kolicinaMax = kolicinaMax;
    this.prodatoMin = prodatoMin;
    this.prodatoMax = prodatoMax;
    this.sortiranje = sortiranje;
    console.log('proizvod.service: primeniFilter(): sortiranje: ', sortiranje);
    this.getProizvodi(
      null,
      naziv,
      proizvodjaci,
      kategorija,
      cenaMin,
      cenaMax,
      kolicinaMin,
      kolicinaMax,
      prodatoMin,
      prodatoMax,
      sortiranje,
      proizvodaPoStrani,
      1
    );
  }

  primeniSortiranje(kriterijum: string) {
    this.sortiranje = kriterijum;
    console.log('proizvod.service: primeniSortiranje(): this.sortiranje: ', this.sortiranje);
    this.getProizvodi(
      null,
      this.naziv,
      this.proizvodjaci,
      this.kategorija,
      this.cenaMin,
      this.cenaMax,
      null,
      null,
      null,
      null,
      this.sortiranje,
      this.proizvodaPoStrani,
      1
    );
  }

  getProizvodjaci() {
    this.http.get<string[]>('http://localhost:3000/api/proizvodjaci/')
    .subscribe(data => {
      this.proizvodjaciArray.next(data);
    });
  }
}
