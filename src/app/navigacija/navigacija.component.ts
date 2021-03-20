import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ObavestenjeService } from '../obavestenje.service';
import { Obavestenje } from '../obavestenje.model';
import { ProizvodService } from '../proizvod.service';

@Component({
  selector: 'app-navigacija',
  templateUrl: './navigacija.component.html',
  styleUrls: ['./navigacija.component.css']
})
export class NavigacijaComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  isAdmin = false;
  private authListenerSubs: Subscription;
  private obavestenjaSubs: Subscription;
  obavestenja: Obavestenje[] = [];
  ukupnoObavestenja: number;
  danasnjiDatum: Date;

  constructor(private authService: AuthService, public obavestenjeService: ObavestenjeService, public proizvodService: ProizvodService) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(data => {
        this.userIsAuthenticated = data.isAuthenticated;
        this.isAdmin = data.isAdmin;
        console.log('navigacija.component: ngOnInit(): userIsAuthenticated: ' + this.userIsAuthenticated);
        console.log('navigacija.component: ngOnInit(): isAdmin: ' + this.isAdmin);
      });
    this.obavestenjaSubs = this.obavestenjeService.getObavestenjaZaNavigacijuUpdateListener()
    .subscribe(data => {
      // console.log('navigacija.component: ngOnIgetObavestenjaZaNavigacijuUpdateListener(): ima jos:' + data.ukupnoObavestenja);
      this.obavestenja = data.obavestenja;
      this.ukupnoObavestenja = data.ukupnoObavestenja;
    });
    setInterval(() => {
      if (this.authService.getIsAdmin()) {
        this.obavestenjeService.getObavestenjaZaNavigaciju();
      }
    }, 3000);
    this.danasnjiDatum = new Date();
  }

  onLogout() {
    this.authService.logout();
  }

  klikNaObavestenje(obavestenje: Obavestenje) {
    console.log('klik na obavestenje');
    this.obavestenjeService.updateObavestenje(obavestenje._id);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.obavestenjaSubs.unsubscribe();
  }
}
