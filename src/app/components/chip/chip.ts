import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { TimesCircleIcon } from 'primeng/icons/timescircle';
/**
 * Chip represents people using icons, labels and images.
 * @group Components
 */
@Component({
    selector: 'p-chip',
    template: `
        <div [ngClass]="{ 'p-chip p-component': true, 'p-chip-image': this.image != null, 'p-chip-removable': removable }" [class]="styleClass" [ngStyle]="style" *ngIf="visible" [tabindex]="removable ? 0 : -1" (click)="removable && close($event)" (keydown.enter)="removable && close($event)">
            <ng-content></ng-content>
            <img [src]="image" *ngIf="image; else iconTemplate" (error)="imageError($event)" />
            <ng-template #iconTemplate><span *ngIf="icon" [class]="icon" [ngClass]="'p-chip-icon'"></span></ng-template>
            <div class="p-chip-text" *ngIf="label">{{ label }}</div>
            <ng-container *ngIf="removable">
                <ng-container *ngIf="!removeIconTemplate">
                    <span *ngIf="removeIcon" [class]="removeIcon" [ngClass]="'pi-chip-remove-icon'"></span>
                    <TimesCircleIcon [attr.tabindex]="0" *ngIf="!removeIcon" [styleClass]="'pi-chip-remove-icon'"/>
                </ng-container>
                <span *ngIf="removeIconTemplate" class="pi-chip-remove-icon">
                    <ng-template *ngTemplateOutlet="removeIconTemplate"></ng-template>
                </span>
            </ng-container>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./chip.css'],
    host: {
        class: 'p-element'
    }
})
export class Chip implements AfterContentInit {
    /**
     * Defines the text to display.
     * @group Props
     */
    @Input() label: string | undefined;
    /**
     * Defines the icon to display.
     * @group Props
     */
    @Input() icon: string | undefined;
    /**
     * Defines the image to display.
     * @group Props
     */
    @Input() image: string | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Whether to display a remove icon.
     * @group Props
     */
    @Input() removable: boolean | undefined = false;
    /**
     * Icon of the remove element.
     * @group Props
     */
    @Input() removeIcon: string | undefined = 'ms ms-cancel ms-icon-sm';
    /**
     * Callback to invoke when a chip is removed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    @Output() onRemove: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onImageError: EventEmitter<Event> = new EventEmitter<Event>();

    visible: boolean = true;

    removeIconTemplate: TemplateRef<any> | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    ngAfterContentInit() {
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'removeicon':
                    this.removeIconTemplate = item.template;
                    break;

                default:
                    this.removeIconTemplate = item.template;
                    break;
            }
        });
    }

    containerClass() {
        return {
            'p-chip p-component': true,
            'p-chip-image': this.image != null
        };
    }

    close(event: MouseEvent) {
        this.visible = false;
        this.onRemove.emit(event);
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }
}

@NgModule({
    imports: [CommonModule, TimesCircleIcon, SharedModule],
    exports: [Chip, SharedModule],
    declarations: [Chip]
})
export class ChipModule {}
