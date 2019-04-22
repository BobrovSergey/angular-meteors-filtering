import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { FiltersComponent } from './components/filters/filters.component';
import { MeteorsService } from './shared/services/meteors.service';
import { MeteorInterface } from './shared/interfaces/meteor.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  years: number[] = [];
  filters$ = new BehaviorSubject({year: null, mass: null});
  meteors$: Observable<MeteorInterface[]>;
  noMeteorsFoundInThisYear = false;
  @ViewChild('filters') filtersComponent: FiltersComponent;

  constructor(private meteorsService: MeteorsService) {}

  ngOnInit(): void {
    this.meteors$ = this.meteorsService.get()
      .pipe(
        tap((meteors: MeteorInterface[]) => {
          this.years = meteors
            .map((meteor: MeteorInterface) => new Date(meteor.year).getFullYear())
            .filter(this.onlyUnique)
            .sort((a, b) => a - b);
        }),
        switchMap((meteors: MeteorInterface[]) => {
          return this.filters$
            .pipe(
              map(({year, mass}) => {
                const result = this.filterMeteors(meteors, year, mass);

                return this.findClosestMeteorsByMass(result, meteors, mass);
              })
            );
        })
    );
  }

  /**
   * Handle filters changed event
   */
  filtersChanged(filter): void {
    this.filters$.next(filter);
  }

  /**
   * Filter meteors by year and by mass
   * @param meteors MeteorInterface[]
   * @param year number
   * @param mass number
   */
  private filterMeteors(meteors: MeteorInterface[], year: number, mass: number): MeteorInterface[] {
    let result = this.filterMeteorsByYear(meteors, year);
    result = this.filterMeteorsByMass(result, mass);

    return result;
  }

  /**
   * Filters meteors by year
   * @param meteors MeteorInterface[]
   * @param year number
   */
  private filterMeteorsByYear(meteors: MeteorInterface[], year: number): MeteorInterface[] {
    if (year) {
      return meteors.filter(item => new Date(item.year).getFullYear() === year);
    }
    return meteors;
  }

  /**
   * Filters meteors by mass
   * @param meteors MeteorInterface[]
   * @param mass number
   */
  private filterMeteorsByMass(meteors: MeteorInterface[], mass: number): MeteorInterface[] {
    if (mass) {
      return meteors.filter(item => this.compareMass(+item.mass, mass));
    }
    return meteors;
  }

  /**
   * Filtering meteor by mass
   * If there is no filtered meteors - finding closes suitable year and return meteors of this year
   * @param filteredMeteors MeteorInterface[]
   * @param initialList MeteorInterface[]
   * @param mass number
   */
  private findClosestMeteorsByMass(filteredMeteors: MeteorInterface[], initialList: MeteorInterface[], mass: number): MeteorInterface[] {
    if (!filteredMeteors.length) {
      return this.findClosestMeteorsInInitialList(initialList, mass);
    }

    this.noMeteorsFoundInThisYear = false;
    return filteredMeteors;
  }

  /**
   * Find closest meteors in initials list by mass
   * If there is no suitable meteor - reset filters values
   * @param meteors MeteorInterface[]
   * @param mass number
   */
  private findClosestMeteorsInInitialList(meteors: MeteorInterface[], mass: number) {
    const nearestMeteor = this.findNearestMeteor(meteors, mass);

    this.noMeteorsFoundInThisYear = !!nearestMeteor;

    if (nearestMeteor) {
      const foundYear = new Date(nearestMeteor.year).getFullYear();
      this.filtersComponent.yearFilterControl.setValue(foundYear, {emitEvent: false});

      return this.filterMeteors(meteors, foundYear, mass);
    }

    this.filtersComponent.resetFilters();
    return meteors;
  }

  /**
   * Looking for suitable meteor by mass
   * @param meteors MeteorInterface[]
   * @param mass number
   */
  private findNearestMeteor(meteors: MeteorInterface[], mass: number): MeteorInterface {
    return meteors.find(meteor => this.compareMass(parseInt(meteor.mass, 10), mass));
  }

  /**
   * Comparing to masses
   * Returns true if first mass is bigger than second, otherwise - returns false
   * @param mass1 number
   * @param mass2 number
   */
  private compareMass(mass1: number, mass2: number): boolean {
    return mass1 > mass2;
  }

  /**
   * Check array for unique values
   * @param value number
   * @param index number
   * @param self number[]
   */
  private onlyUnique(value: number, index: number, self: number[]): boolean {
    return self.indexOf(value) === index;
  }
}
