import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-canopies',
  templateUrl: './canopies.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanopiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
