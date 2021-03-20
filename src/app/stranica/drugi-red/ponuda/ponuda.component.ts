import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProizvodService } from 'src/app/proizvod.service';
import { Proizvod } from 'src/app/proizvod.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ponuda',
  templateUrl: './ponuda.component.html'
})
export class PonudaComponent implements OnInit, OnDestroy {
  proizvodi: Proizvod[] = [];
  private proizvodiSub: Subscription;
  ucitavanje = false;

  ukupnoProizvoda = 0; // ukupnoProizvoda - totalProducts
  proizvodaPoStrani = 10; // proizvodaPoStrani - productsPerPage
  trenutnaStrana = 1; // trenutnaStrana - currentPage

  querySub: Subscription;
  fetchingSub: Subscription;
  odabraniPojam: string;
  odabraniKriterijum: string;

  naziv: string;
  cenaMin: number;
  cenaMax: number;
  kategorija: string;
  sortiranje: string;

  constructor(public proizvodService: ProizvodService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    document.title = 'Ponuda | STAR computers';

    this.ucitavanje = true;
    this.fetchingSub = this.proizvodService
    .getProizvodFetchingListener()
    .subscribe(fetching => {
      this.ucitavanje = fetching;
    });
    this.proizvodiSub = this.proizvodService
    .getProizvodUpdateListener()
    .subscribe((proizvodiData: { proizvodi: Proizvod[], brojProizvoda: number }) => {
      console.log('ponudaComponent: ukupan broj proizvoda: ' + proizvodiData.brojProizvoda);
      this.ukupnoProizvoda = proizvodiData.brojProizvoda;
      this.proizvodi = proizvodiData.proizvodi;
      this.ucitavanje = false;
    });
    this.querySub = this.activatedRoute.queryParams.subscribe(params => {
      this.kategorija = params['kategorija'.toString()];
      this.naziv = params['naziv'.toString()];
      console.log('ponudaComponent: ngOnInit(): odabraniKriterijum: ', this.odabraniKriterijum);
      console.log('ponudaComponent: ngOnInit(): odabraniPojam: ', this.odabraniPojam);

      this.proizvodService.naziv = this.naziv;

      this.proizvodService.getProizvodi(
        null,
        null,
        null,
        this.kategorija,
        null,
        null,
        null,
        null,
        null,
        null,
        this.sortiranje,
        this.proizvodaPoStrani,
        this.trenutnaStrana
      );

    });
  }

  ngOnDestroy() {
    this.proizvodiSub.unsubscribe();
    this.querySub.unsubscribe();
  }

  promenaStrane(param: string) {
    if (param === 'sledeca') {
      if (!(this.trenutnaStrana * this.proizvodaPoStrani < this.ukupnoProizvoda)) {
        return;
      }
      this.trenutnaStrana++;
    } else if (param === 'prethodna') {
      if (this.trenutnaStrana === 1) {
        return;
      }
      this.trenutnaStrana--;
    }
    this.ucitavanje = true;
    this.proizvodService.getProizvodi(
      null,
      null,
      null,
      this.kategorija,
      null,
      null,
      null,
      null,
      null,
      null,
      this.sortiranje,
      this.proizvodaPoStrani,
      this.trenutnaStrana
    );
  }

  // promenaKriterijumaSortiranja(kriterijum: string) {
  //   this.sortiranje = kriterijum;
  //   console.log('ponuda.component: promenaKriterijumaSortiranja(): this.sortiranje: ', this.sortiranje);
  //   this.proizvodService.primeniSortiranje(kriterijum);
  // }
}
