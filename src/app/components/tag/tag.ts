import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { SharedModule } from 'primeng/api';
import { RouterLink, RouterModule } from '@angular/router';

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
    @Input() styleClass: string;

    @Input() style: any;

    @Input() value: string;

    @Input() icon: string;

    @Input() link: RouterLink['routerLink'];

    @Input() rounded: boolean;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    iconTemplate: TemplateRef<any>;

    ngAfterContentInit() {
        this.templates.forEach((item) => {
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
export class TagModule {}
