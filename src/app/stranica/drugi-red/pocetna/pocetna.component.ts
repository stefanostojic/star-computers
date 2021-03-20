import { Component, OnInit } from '@angular/core';
import { ProizvodMin } from 'src/app/proizvod.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit {

  najprodavanijiRacunari = [] as ProizvodMin[];
  najprodavanijiLaptopovi = [] as ProizvodMin[];
  najprodavanijiTelefoni = [] as ProizvodMin[];

  ucitavanje: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    document.title = 'Početna | STAR computers';

    // console.log('zahtev za najprodavanije racunare je upucen');
    this.ucitavanje = true;
    this.http.get<{
      najprodavanijiRacunari: ProizvodMin[],
      najprodavanijiLaptopovi: ProizvodMin[],
      najprodavanijiTelefoni: ProizvodMin[]
    }>('http://localhost:3000/api/najprodavaniji/')
    .subscribe(data => {
      this.ucitavanje = false;
      this.najprodavanijiRacunari = data.najprodavanijiRacunari;
      this.najprodavanijiLaptopovi = data.najprodavanijiLaptopovi;
      this.najprodavanijiTelefoni = data.najprodavanijiTelefoni;
      // console.log('zahtev za najprodavanije racunare je razresen');
    });
  }

}
