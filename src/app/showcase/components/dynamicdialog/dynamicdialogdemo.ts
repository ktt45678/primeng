import { Component, OnDestroy } from '@angular/core';
import { DialogService } from '../../../components/dynamicdialog/dialogservice';
import { MessageService } from 'primeng/api';
import { ProductListDemo } from './productlistdemo';
import { ProductListDemoMinimal } from './productlistdemo-minimal';
import { DynamicDialogRef } from '../../../components/dynamicdialog/dynamicdialog-ref';
import { Product } from '../../domain/product';

@Component({
    templateUrl: './dynamicdialogdemo.html',
    providers: [DialogService, MessageService]
})
export class DynamicDialogDemo implements OnDestroy {
    constructor(public dialogService: DialogService, public messageService: MessageService) {}

    ref: DynamicDialogRef;

    show() {
        this.ref = this.dialogService.open(ProductListDemo, {
            header: 'Choose a Product',
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
            minimal: false
        });

        this.ref.onClose.subscribe((product: Product) => {
            if (product) {
                this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
            }
        });

        this.ref.onMaximize.subscribe((value) => {
            this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
        });
    }

    showMinimal() {
        this.ref = this.dialogService.open(ProductListDemoMinimal, {
            header: 'Choose a Product',
            width: '70%',
            baseZIndex: 10000,
            maximizable: true,
            minimal: true
        });

        this.ref.onClose.subscribe((product: Product) => {
            if (product) {
                this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
            }
        });

        this.ref.onMaximize.subscribe((value) => {
            this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
        });
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }
}
