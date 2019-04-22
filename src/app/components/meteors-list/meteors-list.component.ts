import { Component, Input } from '@angular/core';
import { MeteorInterface } from '../../shared/interfaces/meteor.interface';

@Component({
  selector: 'app-meteors-list',
  templateUrl: './meteors-list.component.html',
  styleUrls: ['./meteors-list.component.scss']
})
export class MeteorsListComponent {
  @Input() meteors: MeteorInterface[] = [];
}
