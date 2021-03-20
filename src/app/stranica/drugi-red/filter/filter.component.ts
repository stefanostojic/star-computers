import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProizvodService } from 'src/app/proizvod.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() kategorija: string;
  @Input() proizvodaPoStrani: number;

  sortiranje: string;

  proizvodjaci = [
    'STAR',
    'HP',
    'Acer',
    'Lenovo',
    'Samsung',
    'Huawei'
  ];

  odabraniProizvodjaci = [] as string[];

  filterForm: FormGroup;

  constructor(private proizvodService: ProizvodService) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      naziv: new FormControl(null),
      cenaMin: new FormControl(null, { validators: [Validators.min(0)] }),
      cenaMax: new FormControl(null, { validators: [Validators.min(1)] }),
    });
  }

  ngOnDestroy() {
    this.proizvodService.primeniFilter(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  promenaKriterijumaSortiranja(kriterijum: string) {
    console.log('filter.component: promenaKriterijumaSosrtiranja(): ', kriterijum);
    this.sortiranje = kriterijum;
  }

  postavljanjeProizvodjaca(proizvodjac: string) {
    console.log('filter.component: promenaKriterijumaSortiranja(): ', proizvodjac);
    const index = this.odabraniProizvodjaci.findIndex(p => p === proizvodjac);
    if (index === -1) {
      this.odabraniProizvodjaci.push(proizvodjac);
      console.log('proizvodjac ' + proizvodjac + ' je odabran');
    } else {
      this.odabraniProizvodjaci = this.odabraniProizvodjaci.filter(p => p !== proizvodjac);
      console.log('proizvodjac ' + proizvodjac + ' nije odabran');
    }
  }

  primeniFilter() {
    console.log('filter.component: primeniFilter(): ', this.sortiranje);
    this.proizvodService.primeniFilter(
      this.filterForm.get('naziv').value,
      this.odabraniProizvodjaci,
      this.kategorija,
      this.filterForm.get('cenaMin').value,
      this.filterForm.get('cenaMax').value,
      null,
      null,
      null,
      null,
      this.sortiranje,
      this.proizvodaPoStrani
    );
    this.filterForm.markAsUntouched();
  }

  promenaBrojProizvodaPoStrani(kriterijum: number) {
    this.proizvodaPoStrani = kriterijum;
  }
}
