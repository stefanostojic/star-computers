import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Porudzbina, PorudzbinaSaKorisnikom } from 'src/app/porudzbina.model';
import { PorudzbinaService } from 'src/app/porudzbina.service';
import { Subscribable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-porudzbine',
  templateUrl: './porudzbine.component.html',
  styleUrls: ['./porudzbine.component.css']
})

export class PorudzbineComponent implements OnInit {
  porudzbine = [] as Porudzbina[];
  porudzbineSub: Subscription;
  porudzbinaSub: Subscription;
  idZaPretragu: string;
  pretragaUToku = false;
  ucitavanjeOdabranePorudzbine = false;
  odabranaPorudzbina: PorudzbinaSaKorisnikom;
  obradjenost = 'sve';

  ukupnoPorudzbina = 0; // ukupnoProizvoda - totalProducts
  porudzbinaPoStrani = 10; // proizvodaPoStrani - productsPerPage
  trenutnaStrana = 1; // trenutnaStrana - currentPage

  constructor(private porudzbinaService: PorudzbinaService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    document.title = 'Porudžbine | STAR computers';
    this.pretragaUToku = true;
    this.porudzbineSub = this.porudzbinaService.getPorudzbineUpdateListener()
    .subscribe( data => {
      this.porudzbine = data.porudzbine;
      this.ukupnoPorudzbina = data.ukupnoPorudzbina;
      this.pretragaUToku = false;
    });
    this.porudzbinaSub = this.porudzbinaService.getPorudzbinaGetListener()
    .subscribe( data => {
      this.odabranaPorudzbina = data;
      this.ucitavanjeOdabranePorudzbine = false;
    });
    this.porudzbinaService.getPorudzbine(this.idZaPretragu, this.obradjenost, this.porudzbinaPoStrani, this.trenutnaStrana);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== '' && id !== null && id !== undefined) {
      console.log('porudzbina iz obavestenja...');
      this.ucitavanjeOdabranePorudzbine = true;
      this.porudzbinaService.getPorudzbina(id);
    }
  }

  odabirPorudzbine(porudzbina: Porudzbina) {
    console.log('odabrana porudzbina: ', porudzbina);
    if (this.odabranaPorudzbina === null || this.odabranaPorudzbina === undefined
      || this.odabranaPorudzbina._id === null || this.odabranaPorudzbina._id !== porudzbina._id) {
      this.ucitavanjeOdabranePorudzbine = true;
      this.porudzbinaService.getPorudzbina(porudzbina._id);
    } else {
      this.odabranaPorudzbina = null;
    }
  }

  promenaStrane(param: string) {
    if (param === 'sledeca') {
      if (!(this.trenutnaStrana * this.porudzbinaPoStrani < this.ukupnoPorudzbina)) {
        return;
      }
      this.trenutnaStrana++;
    } else if (param === 'prethodna') {
      if (this.trenutnaStrana === 1) {
        return;
      }
      this.trenutnaStrana--;
    }
    this.pretragaUToku = true;
    this.porudzbinaService.getPorudzbine(
      this.idZaPretragu,
      this.obradjenost,
      this.porudzbinaPoStrani,
      this.trenutnaStrana
    );
  }

  promenaKriterijuma(kriterijum: string) {
    console.log('promenaKriterijuma: ', kriterijum);
    this.obradjenost = kriterijum;
    this.pretragaUToku = true;
    this.porudzbinaService.getPorudzbine(
      this.idZaPretragu,
      this.obradjenost,
      this.porudzbinaPoStrani,
      this.trenutnaStrana
    );
  }

  obradi() {
    this.pretragaUToku = true;
    if (this.odabranaPorudzbina.obradjenost === 'obradjena') {
      this.porudzbinaService.obradaPorudzbine(
        this.odabranaPorudzbina._id,
        'neobradjena',
        this.idZaPretragu,
        this.obradjenost,
        this.porudzbinaPoStrani,
        this.trenutnaStrana
      );
      this.odabranaPorudzbina.obradjenost = 'neobradjena';
    } else {
      this.porudzbinaService.obradaPorudzbine(
        this.odabranaPorudzbina._id,
        'obradjena',
        this.idZaPretragu,
        this.obradjenost,
        this.porudzbinaPoStrani,
        this.trenutnaStrana
      );
      this.odabranaPorudzbina.obradjenost = 'obradjena';
    }
  }
}
