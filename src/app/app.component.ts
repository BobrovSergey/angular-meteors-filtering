import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltersComponent } from './components/filters/filters.component';
import { MeteorsService } from './shared/services/meteors.service';
import { MeteorInterface } from './shared/interfaces/meteor.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'meteors';
  years: number[];
  filters$ = new BehaviorSubject({year: null, mass: null});
  meteors$: Observable<MeteorInterface[]>;
  isNotificationVisible = false;
  @ViewChild('filters') filtersComponent: FiltersComponent;

  constructor(private meteorsService: MeteorsService) {}

  ngOnInit(): void {
    this.meteors$ = this.meteorsService.get()
      .pipe(
        tap((meteors: MeteorInterface[]) => {
          this.years = meteors
            .map(meteor => new Date(meteor.year).getFullYear())
            .filter(this.onlyUnique)
            .sort((a, b) => a - b);
        }),
        switchMap((meteors: MeteorInterface[]) => {
          return this.filters$
            .pipe(
              map(({year, mass}) => {
                let result = [...meteors];
                if (year) {
                  result = this.filterMeteorsByYear(result, year);
                }
                if (mass) {
                  result = this.filterMeteorsByMass(result, mass);
                }
                if (!result.length) {
                  result = this.filterMeteorsByYearAndMass(meteors, +mass);
                } else {
                  this.isNotificationVisible = false;
                }
                return result;
              })
            );
        })
    );
  }

  filtersChanged(filter) {
    this.filters$.next(filter);
  }

  private filterMeteorsByYear(meteors: MeteorInterface[], year: number): MeteorInterface[] {
    return meteors.filter(item => new Date(item.year).getFullYear() === year);
  }

  private filterMeteorsByMass(meteors: MeteorInterface[], mass: number): MeteorInterface[] {
    return meteors.filter(item => this.compareMass(+item.mass, mass));
  }

  private compareMass(mass1: number, mass2: number): boolean {
    return mass1 > mass2;
  }

  private filterMeteorsByYearAndMass(meteors: MeteorInterface[], mass: number): MeteorInterface[] {
    let result = [...meteors];
    const foundMeteor = meteors.find(meteor => this.compareMass(+meteor.mass, +mass));
    this.isNotificationVisible = !!foundMeteor;
    if (foundMeteor) {
      const foundYear = new Date(foundMeteor.year).getFullYear();
      this.filtersComponent.yearFilterControl.setValue(foundYear, {emitEvent: false});
      result = this.filterMeteorsByYear(meteors, foundYear);
      result = this.filterMeteorsByMass(result, mass);
    } else {
      this.filtersComponent.resetFilters();
    }
    return result;
  }

  private onlyUnique(value: number, index: number, self: number[]): boolean {
    return self.indexOf(value) === index;
  }

}
