import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProizvodService } from 'src/app/proizvod.service';
import { Subject, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pretraga',
  templateUrl: './pretraga.component.html',
  styleUrls: ['./pretraga.component.css']
})
export class PretragaComponent implements OnInit, OnDestroy {
  pojamZaPretragu: string;
  cekanjeRezultata: boolean;
  rezultatiSub: Subscription;
  querySub: Subscription;
  stariPojamZaPretragu: string;

  constructor(private proizvodService: ProizvodService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.querySub = this.activatedRoute.queryParams.subscribe(params => {
      this.stariPojamZaPretragu = params['pojam'.toString()];
    });
    this.rezultatiSub = this.proizvodService.getProizvodUpdateListener()
    .subscribe(() => {
      this.cekanjeRezultata = false;
    });
  }

  ngOnDestroy() {
    this.rezultatiSub.unsubscribe();
  }

  pretraga() {
    if (!this.cekanjeRezultata && this.pojamZaPretragu !== this.stariPojamZaPretragu) {
      this.cekanjeRezultata = true;
      this.stariPojamZaPretragu = this.pojamZaPretragu;
      // this.router.navigate(['/proizvodi'], { queryParams: { kriterijum: 'NazivIliSazetOpis', pojam: this.pojamZaPretragu } });
      this.router.navigate(['/proizvodi'], { queryParams: { naziv: this.pojamZaPretragu } });
    }
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.pretraga();
    }
  }
}
