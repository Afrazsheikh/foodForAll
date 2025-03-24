import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, MatTabsModule],
})
export class SharedModule {}
