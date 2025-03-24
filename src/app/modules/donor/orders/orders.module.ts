import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { ordersRoutes } from 'app/modules/donor/orders/orders.routing';
import { OrdersComponent } from 'app/modules/donor/orders/orders.component';
import { OrdersListComponent } from 'app/modules/donor/orders/list/orders-list.component';
import { MailboxComposeComponent } from 'app/modules/donor/orders/compose/compose.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';

@NgModule({
    declarations: [
        OrdersComponent,
        OrdersListComponent,
        MailboxComposeComponent,
        LocationDialogComponent,
    ],
    imports: [
        AgmCoreModule,
        MatGoogleMapsAutocompleteModule,
        RouterModule.forChild(ordersRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        MatDialogModule,
        MatDatepickerModule,
        MatMomentDateModule,
        // GoogleMapsModule,
    ],
})
export class DonorsOrdersModule {}
