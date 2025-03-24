import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from 'app/modules/donor/orders/orders.service';
import { Donations } from '../orders.types';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'mailbox-compose',
    templateUrl: './compose.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MailboxComposeComponent implements OnInit {
    @ViewChild('itemSelect') itemSelect!: MatSelect;
    createdDonation: FormGroup;
    availableTime: Array<{ id: string; time: string }>;
    todayDate: Date = new Date();

    // Chips Data
    chips: string[] = ['Food', 'Clothes', 'Books'];
    selectedItemControl = new FormControl(null);
    searchTerm: string = '';
    selectedChips: { name: string; quantity: number }[] = [];

    availableItems = [
        { name: 'Rice', quantity: 1 },
        { name: 'Wheat', quantity: 1 },
        { name: 'Sugar', quantity: 1 },
        { name: 'Pulses', quantity: 1 },
        { name: 'Flour', quantity: 1 },
        { name: 'Salt', quantity: 1 },
        { name: 'Oil', quantity: 1 },
    ];
    availableItemsNon = [
        { name: 'Chicken', quantity: 1 },
        { name: 'Kabob', quantity: 1 },
        { name: 'Biryani', quantity: 1 },
        { name: 'Mutton Kabob', quantity: 1 },
        { name: 'Chicken Tikka', quantity: 1 },
    ];
    filteredItems = [...this.availableItems];
    selectedFoodType: string;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder,
        private _ordersService: OrdersService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.createdDonation = this._formBuilder.group({
            donationTime: ['', [Validators.required]],
            donationDate: ['', [Validators.required]],
            selectedItems: this._formBuilder.array([]), // To store selected items
        });

        this.availableTime = [
            { id: 'Afternoon', time: 'Afternoon' },
            { id: 'Dinner', time: 'Dinner' },
        ];
        this.todayDate.setDate(this.todayDate.getDate() + 1);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Discard the message
     */
    discard(): void {
        this.matDialogRef.close();
    }

    /**
     * Send the message
     */
    donate(): void {
        // Collect selected chips and their quantities
        const selectedItems = this.selectedChips.map((chip) => ({
            name: chip.name,
            quantity: chip.quantity,
        }));
        console.log(selectedItems);

        let donation: Donations = {
            id: 'empty',
            currentState: 'Added',
            donationTime: this.createdDonation.getRawValue().donationTime,
            donationDate: this.createdDonation.getRawValue().donationDate,
            pickupAddress: '',
            dropAddress: '',
            volunteerName: '',
            pincode: '',
            selectedItems: selectedItems,
        };

        this._ordersService
            .createDonation(donation)
            .subscribe((newDonation) => {
                this.matDialogRef.close();
            });
    }

    // Filter items based on search input
    filterItems() {
        this.filteredItems = this.availableItems.filter((item) =>
            item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }
    // When user selects an item
    onItemSelect(selectedItem: any) {
        if (!selectedItem) return;

        // Check if the item is already in the selectedChips list
        const existingItem = this.selectedChips.find(
            (chip) => chip.name === selectedItem.name
        );

        if (existingItem) {
            existingItem.quantity++; // Increase quantity if already present
        } else {
            this.selectedChips.push({ ...selectedItem, quantity: 1 });
        }

        // Reset dropdown selection
        this.selectedItemControl.setValue(null);
    }

    // Increase quantity
    increaseQuantity(chip: any) {
        chip.quantity++;
    }

    // Decrease quantity (min: 1)
    decreaseQuantity(chip: any) {
        if (chip.quantity > 1) {
            chip.quantity--;
        } else {
            this.removeChip(chip);
        }
    }

    // Remove chip from the list
    removeChip(chip: any) {
        this.selectedChips = this.selectedChips.filter((item) => item !== chip);
    }
    // Toggle food type selection
    selectFoodType(type: string) {
        this.selectedFoodType = type;
        console.log(this.selectedFoodType);
        if (this.selectedFoodType === 'non-veg') {
            this.filteredItems = [...this.availableItemsNon];
        } else if (this.selectedFoodType === 'veg') {
            this.filteredItems = [...this.availableItems];
        }
    }
    // Toggle item selection
    toggleItemSelection(item: any) {
        const selectedItems = this.createdDonation.get(
            'selectedItems'
        ) as FormArray;
        const index = selectedItems.controls.findIndex(
            (control) => control.value === item.name
        );

        if (index > -1) {
            selectedItems.removeAt(index);
        } else {
            selectedItems.push(new FormControl(item.name));
        }
    }
    // Close the dropdown on mouse leave
    closeDropdown(select: MatSelect) {
        select.close();
    }
    // Open dropdown on mouse enter
    openDropdown(select: MatSelect) {
        select.open();
    }
}
