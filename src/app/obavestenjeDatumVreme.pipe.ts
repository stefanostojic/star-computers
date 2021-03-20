import { Pipe, PipeTransform } from '@angular/core';
import { Obavestenje } from './obavestenje.model';

@Pipe({
  name: 'obavestenjeDatumVreme'
})
export class ObavestenjeDatumVreme implements PipeTransform {
  transform(obavestenjeDateString: any): string {

    const danas = new Date();
    const obavestenjeDate = new Date(obavestenjeDateString);

    const jesteDanas = obavestenjeDate.getDate() === danas.getDate() &&
    obavestenjeDate.getMonth() === danas.getMonth() &&
    obavestenjeDate.getFullYear() === danas.getFullYear();

    const meseci = [
      'januar',
      'februar',
      'mart',
      'april',
      'maj',
      'jun',
      'jul',
      'avgust',
      'septembar',
      'oktobar',
      'novembar',
      'decembar'
    ];
    const daniUNedelji = [
      'Nedelja',
      'Ponedeljak',
      'Utorak',
      'Sreda',
      'Četvrtak',
      'Petak',
      'Subota'
    ];

    if (jesteDanas) {
      return 'Danas, u ' + obavestenjeDate.getHours() + ':' +
      (obavestenjeDate.getMinutes().toString().length === 1 ? ('0' + obavestenjeDate.getMinutes()) : obavestenjeDate.getMinutes());
    } else if (danas.getFullYear() === obavestenjeDate.getFullYear()) {
      return daniUNedelji[obavestenjeDate.getDay()] + ', ' + obavestenjeDate.getDate() + '. ' + meseci[obavestenjeDate.getMonth()];
    } else {
      return obavestenjeDate.getDate() + '. ' + meseci[obavestenjeDate.getMonth()] +
      obavestenjeDate.getFullYear();
    }
  }
}
