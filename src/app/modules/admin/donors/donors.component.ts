import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonorsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
