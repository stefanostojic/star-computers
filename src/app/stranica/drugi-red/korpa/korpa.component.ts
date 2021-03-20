import { Component, OnInit, OnDestroy } from '@angular/core';
import { PorudzbinaService } from 'src/app/porudzbina.service';
import { stringify } from 'querystring';
import { StavkaKorpe } from 'src/app/stavka-korpe.model';
import { ObavestenjeService } from 'src/app/obavestenje.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Korisnik } from 'src/app/korisnik.model';
import { KorisniciService } from 'src/app/korisnici.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-korpa',
  templateUrl: './korpa.component.html',
  styleUrls: ['./korpa.component.css']
})
export class KorpaComponent implements OnInit, OnDestroy {
  stavke: {
    proizvodId: string
    naziv: string,
    slika: string,
    cena: number,
    kolicina: number
  }[] = [];
  ukupno: number;
  potvrdaPorudzbine: boolean;
  private potvrdaPorudzbineSub: Subscription;
  private podaciOKorisnikuSub: Subscription;
  nastavljanjeUToku: boolean;
  potvrdjivanjeUToku: boolean;
  korisnik: Korisnik = null;
  stanjePotvrdePorudzbine: string;
  napomena: string;

  constructor(private porudzbinaService: PorudzbinaService, private korisnikService: KorisniciService, private authService: AuthService) { }

  ngOnInit() {
    document.title = 'Korpa | STAR computers';

    this.popuniKorpu();
    this.podaciOKorisnikuSub = this.korisnikService.getKorisnikUpdateListener()
      .subscribe(korisnik => {
        this.korisnik = korisnik;
        this.nastavljanjeUToku = false;
      });
    this.potvrdaPorudzbineSub = this.porudzbinaService.getPotvrdaPorudzbineUpdateListener()
    .subscribe(novoStanje => {
      this.stanjePotvrdePorudzbine = novoStanje.stanje;
      this.potvrdjivanjeUToku = false;
    });
  }

  ngOnDestroy() {
    this.potvrdaPorudzbineSub.unsubscribe();
    this.podaciOKorisnikuSub.unsubscribe();
  }

  obrisiKorpu() {
    localStorage.removeItem('korpa');
    this.popuniKorpu();
  }

  popuniKorpu() {
    this.stavke = [];
    const korpa: StavkaKorpe[] = JSON.parse(localStorage.getItem('korpa'));
    if (korpa) {
      this.ukupno = 0;
      for (const stavka of korpa) {
        this.stavke.push({
          proizvodId: stavka.proizvodId,
          naziv: stavka.naziv,
          slika: stavka.slika,
          cena: stavka.cena,
          kolicina: stavka.kolicina
        });
        this.ukupno += stavka.cena * stavka.kolicina;
      }
    } else {
      this.stavke = [];
    }
  }

  obrisiIzKorpe(proizvodId: string) {
    const korpa = localStorage.getItem('korpa');
    const korpaObj: StavkaKorpe[] = JSON.parse(korpa);
    const novaKorpa = korpaObj.filter(z => z.proizvodId !== proizvodId);
    localStorage.setItem('korpa', JSON.stringify(novaKorpa));
    this.popuniKorpu();
  }

  nastavakKupovine() {
    this.nastavljanjeUToku = true;
    this.korisnikService.getKorisnik(this.authService.getUserId());
  }

  potvrdiKorpu() {
    console.log('Angular: potvrdiKorpu(): ' + JSON.stringify(this.stavke));
    this.potvrdjivanjeUToku = true;
    this.porudzbinaService.addPorudzbina(this.stavke, this.napomena);
    console.log('Angular: potvrdiKorpu(): napomena: ' + this.napomena);
    // this.nastavakKupovine();
    // this.obavestenjeService.addObavestenjePorudzbina();
  }
}
