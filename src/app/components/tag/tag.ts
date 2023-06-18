import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgModule, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { PrimeTemplate, SharedModule } from 'primeng/api';
/**
 * Tag component is used to categorize content.
 * @group Components
 */
@Component({
    selector: 'p-tag',
    template: `
        <ng-container *ngIf="link; else noLink">
            <a class="p-tag p-component" [class]="styleClass" [ngStyle]="style" [routerLink]="link">
                <ng-container [ngTemplateOutlet]="tagContent"></ng-container>
            </a>
        </ng-container>
        <ng-template #noLink>
            <span class="p-tag p-component" [class]="styleClass" [ngStyle]="style">
                <ng-container [ngTemplateOutlet]="tagContent"></ng-container>
            </span>
        </ng-template>
        <ng-template #tagContent>
            <ng-content></ng-content>
            <ng-container *ngIf="!iconTemplate">
                <span class="p-tag-icon" [ngClass]="icon" *ngIf="icon"></span>
            </ng-container>
            <span class="p-tag-icon" *ngIf="iconTemplate">
                <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
            </span>
            <span class="p-tag-value">{{ value }}</span>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./tag.css'],
    host: {
        class: 'p-element'
    }
})
export class Tag {
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Severity type of the tag.
     * @group Props
     */
    @Input() severity: 'success' | 'info' | 'warning' | 'danger' | string | undefined;
    /**
     * Value to display inside the tag.
     * @group Props
     */
    @Input() value: string | undefined;
    /**
     * Icon of the tag to display next to the value.
     * @group Props
     * @deprecated since 15.4.2. Use 'icon' template.
     */
    @Input() icon: string | undefined;
    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    @Input() rounded: boolean | undefined;
    /**
     * Link for navigation.
     * @group Props
     */
    @Input() link: RouterLink['routerLink'];

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    iconTemplate: TemplateRef<any> | undefined;

    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
            }
        });
    }
}

@NgModule({
    imports: [CommonModule, SharedModule, RouterModule],
    exports: [Tag, SharedModule],
    declarations: [Tag]
})
export class TagModule { }
