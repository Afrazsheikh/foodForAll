import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-volunteers',
  templateUrl: './volunteers.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VolunteersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
