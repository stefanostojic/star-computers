import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, TimeInterval } from 'rxjs';
import { Obavestenje } from './obavestenje.model';

@Injectable({ providedIn: 'root' })
export class ObavestenjeService {
  obavestenja: Obavestenje[];
  private obavestenjaUpdated = new Subject<Obavestenje[]>();
  private obavestenjaZaNavigacijuUpdated = new Subject<{ obavestenja: Obavestenje[], ukupnoObavestenja: number }>();

  constructor(private http: HttpClient) {}

  getObavestenjaUpdateListener() {
    return this.obavestenjaUpdated.asObservable();
  }
  getObavestenjaZaNavigacijuUpdateListener() {
    return this.obavestenjaZaNavigacijuUpdated.asObservable();
  }

  getObavestenja() {
      this.http.get<Obavestenje[]>('http://localhost:3000/api/obavestenja')
      .subscribe(response => {
        console.log('obavestenje.service: getObavestenja(): response: ' + JSON.stringify(response));
        this.obavestenjaUpdated.next(response);
      });
  }

  getObavestenjaZaNavigaciju() {
    // console.log('obavestenja.service: getObavestenjaZaNavigaciju()');
    this.http.get<{ obavestenja: Obavestenje[], ukupnoObavestenja: number }>('http://localhost:3000/api/obavestenja/za-navigaciju')
      .subscribe(response => {
        this.obavestenjaZaNavigacijuUpdated.next(response);
      }, error => {
        console.log('GRESKA U OBAVESTENJIMA ZA NAVIGACIJU');
      });
  }

  updateObavestenje(id: string) {
    console.log('obavestenje.service: updateObavestenje(): ' + id);
    // this.http.put('http:localhost:3000/api/obavestenja/' + id, {vidjeno: true})
    this.http.put('http://localhost:3000/api/obavestenja/' + id, {vidjeno: true})
    .subscribe(response => {
      console.log('123obavestenje.service: updateObavestenje(): ' + id + ' gotovo123');
    });
  }
}
