import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'p-chip',
    template: `
        <div [ngClass]="{ 'p-chip-image': image != null, 'p-chip-removable': removable }"
            class="p-chip p-component" [class]="styleClass" [ngStyle]="style" *ngIf="visible" [tabindex]="removable ? 0 : -1"
            (click)="removable && close($event)" (keydown.enter)="removable && close($event)">
            <ng-content></ng-content>
            <img [src]="image" *ngIf="image; else iconTemplate" (error)="imageError($event)" />
            <ng-template #iconTemplate><span *ngIf="icon" class="p-chip-icon" [class]="icon"></span></ng-template>
            <div class="p-chip-text" [class]="textStyleClass" [ngClass]="{ 'tw-cursor-pointer': removable }"
                *ngIf="label">{{ label }}</div>
            <span *ngIf="removable" class="pi-chip-remove-icon" [class]="removeIcon"></span>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./chip.css'],
    host: {
        class: 'p-element'
    }
})
export class Chip {
    @Input() label: string;

    @Input() icon: string;

    @Input() image: string;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() textStyleClass!: string;

    @Input() removable: boolean;

    @Input() removeIcon: string = 'ms ms-cancel ms-icon-sm';

    @Output() onRemove: EventEmitter<any> = new EventEmitter();

    @Output() onImageError: EventEmitter<any> = new EventEmitter();

    visible: boolean = true;

    close(event) {
        this.visible = false;
        this.onRemove.emit(event);
    }

    imageError(event) {
        this.onImageError.emit(event);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Chip],
    declarations: [Chip]
})
export class ChipModule { }
