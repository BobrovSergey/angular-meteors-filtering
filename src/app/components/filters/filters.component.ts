import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  yearFilterControl = new FormControl(null);
  massFilterControl = new FormControl('');
  @Input() years: number[] = [];
  @Output() filtersChanged = new EventEmitter();

  private cancelSubscription$ = new Subject<void>();

  ngOnInit() {
    this.yearFilterControl.valueChanges
      .pipe(
        takeUntil(this.cancelSubscription$)
      )
      .subscribe(year => {
        this.filtersChanged.emit({
          year: parseInt(year, 10),
          mass: parseInt(this.massFilterControl.value, 10)
        });
    });

    this.massFilterControl.valueChanges
      .pipe(
        takeUntil(this.cancelSubscription$)
      )
      .subscribe(mass => {
        this.filtersChanged.emit({
          year: parseInt(this.yearFilterControl.value, 10),
          mass: parseInt(mass, 10),
        });
    });
  }

  public resetFilters(): void {
    this.yearFilterControl.setValue('', {emitEvent: false});
    this.massFilterControl.setValue('', {emitEvent: false});
  }

  public ngOnDestroy(): void {
    this.cancelSubscription$.next();
  }
}
