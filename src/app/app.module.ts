import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { NavigacijaComponent } from './navigacija/navigacija.component';
import { StranicaComponent } from './stranica/stranica.component';

import { PrviRedComponent } from './stranica/prvi-red/prvi-red.component';

import { PocetnaComponent } from './stranica/drugi-red/pocetna/pocetna.component';
import { NumeracijaComponent } from './stranica/drugi-red/numeracija/numeracija.component';
import { FilterComponent } from './stranica/drugi-red/filter/filter.component';
import { PretragaComponent } from './stranica/drugi-red/pretraga/pretraga.component';
import { ProizvodComponent } from './stranica/drugi-red/proizvod/proizvod.component';
import { ProizvodiComponent } from './stranica/drugi-red/administracija/proizvodi/proizvodi.component';
import { PonudaComponent } from './stranica/drugi-red/ponuda/ponuda.component';
import { PrijavaComponent } from './stranica/drugi-red/prijava/prijava.component';
import { RegistracijaComponent } from './stranica/drugi-red/registracija/registracija.component';
import { KorisniciComponent } from './stranica/drugi-red/administracija/korisnici/korisnici.component';
import { PorudzbineComponent } from './stranica/drugi-red/administracija/porudzbine/porudzbine.component';
import { ProfilComponent } from './stranica/drugi-red/profil/profil.component';
import { KorpaComponent } from './stranica/drugi-red/korpa/korpa.component';
import { GreskaComponent } from './stranica/drugi-red/greska/greska.component';

import { TreciRedComponent } from './stranica/treci-red/treci-red.component';
import { TreciRedInformacijeComponent } from './stranica/treci-red/treci-red-informacije/treci-red-informacije.component';
import { TreciRedONamaComponent } from './stranica/treci-red/treci-red-o-nama/treci-red-o-nama.component';
import { TreciRedLokacijaComponent } from './stranica/treci-red/treci-red-lokacija/treci-red-lokacija.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeSr from '@angular/common/locales/sr-Latn';
import { ObavestenjeDatumVreme } from './obavestenjeDatumVreme.pipe';
import { ObavestenjeNazivPorudzbine } from './obavestenjeNazivPorudzbine.pipe';
registerLocaleData(localeSr);

@NgModule({
  declarations: [ // view classes: components, directive i pipes
    AppComponent,
    NavigacijaComponent,
    StranicaComponent,
    PrviRedComponent,
    PocetnaComponent,
    PretragaComponent,
    FilterComponent,
    NumeracijaComponent,
    ProizvodComponent,
    ProizvodiComponent,
    PonudaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    KorisniciComponent,
    PorudzbineComponent,
    ProfilComponent,
    KorpaComponent,
    GreskaComponent,
    TreciRedComponent,
    TreciRedInformacijeComponent,
    TreciRedONamaComponent,
    TreciRedLokacijaComponent,
    ObavestenjeDatumVreme,
    ObavestenjeNazivPorudzbine
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'sr-Latn'},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
