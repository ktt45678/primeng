import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, NgModule, NgZone, OnDestroy, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from 'primeng/dom';

export const SLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderAlt),
    multi: true
};

@Component({
    selector: 'p-sliderAlt',
    template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{ 'p-slider p-component': true, 'p-disabled': disabled, 'p-slider-horizontal': orientation == 'horizontal', 'p-slider-vertical': orientation == 'vertical', 'p-slider-animate': animate }">
            <span *ngIf="orientation == 'vertical'" class="p-slider-range" [ngStyle]="{ height: handleValue + '%' }"></span>
            <span *ngIf="orientation == 'horizontal'" class="p-slider-range" [ngStyle]="{ width: handleValue + '%' }"></span>
            <span
                #sliderHandle
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event)"
                class="p-slider-handle"
                [style.transition]="dragging ? 'none' : null"
                [ngStyle]="{ left: orientation == 'horizontal' ? handleValue + '%' : null, bottom: orientation == 'vertical' ? handleValue + '%' : null }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
        </div>
    `,
    providers: [SLIDER_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../slider/slider.css'],
    host: {
        class: 'p-element p-slider-container',
        '(mousedown)': 'onMouseDown($event)',
        '(touchstart)': 'onTouchStart($event)',
        '(touchmove)': 'onTouchMove($event)',
        '(touchend)': 'onTouchEnd($event)'
    }
})
export class SliderAlt implements OnDestroy, ControlValueAccessor {
    @Input() animate: boolean;

    @Input() disabled: boolean;

    @Input() min: number = 0;

    @Input() max: number = 100;

    @Input() orientation: string = 'horizontal';

    @Input() step: number;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() ariaLabelledBy: string;

    @Input() tabindex: number = 0;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onSlideEnd: EventEmitter<any> = new EventEmitter();

    @ViewChild('sliderHandle') sliderHandle: ElementRef;

    public value: number;

    public values: number[];

    public handleValue: number;

    public handleValues: number[] = [];

    diff: number;

    offset: number;

    bottom: number;

    public onModelChange: Function = () => {};

    public onModelTouched: Function = () => {};

    public dragging: boolean;

    public dragListener: any;

    public mouseupListener: any;

    public initX: number;

    public initY: number;

    public barWidth: number;

    public barHeight: number;

    public sliderHandleClick: boolean;

    public handleIndex: number = 0;

    public startHandleValue: any;

    public startx: number;

    public starty: number;

    constructor(public el: ElementRef, public renderer: Renderer2, private ngZone: NgZone, public cd: ChangeDetectorRef) {}

    onMouseDown(event, index?: number) {
        if (this.disabled) {
            return;
        }

        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        this.handleIndex = index;

        this.handleChange(event);

        this.bindDragListeners();
        event.target.focus();
        event.preventDefault();

        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
    }

    onTouchStart(event, index?: number) {
        if (this.disabled) {
            return;
        }

        var touchobj = event.changedTouches[0];
        this.startHandleValue = this.handleValue;
        this.dragging = true;
        this.handleIndex = index;

        if (this.orientation === 'horizontal') {
            this.startx = parseInt(touchobj.clientX, 10);
            this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        } else {
            this.starty = parseInt(touchobj.clientY, 10);
            this.barHeight = this.el.nativeElement.children[0].offsetHeight;
        }

        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }

        this.updateDomData();
        this.handleTouchStartChange(event);

        if (event.cancelable) event.preventDefault();
    }

    onTouchMove(event, index?: number) {
        if (this.disabled) {
            return;
        }

        const touchobj = event.changedTouches[0];

        const handleValue = this.calculateHandleValue(touchobj);

        this.setValueFromHandle(event, handleValue);

        if (event.cancelable) event.preventDefault();
    }

    onTouchEnd(event, index?: number) {
        if (this.disabled) {
            return;
        }

        this.dragging = false;

        this.onSlideEnd.emit({ originalEvent: event, value: this.value });

        if (this.animate) {
            DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }

        if (event.cancelable) event.preventDefault();
    }

    onBarClick(event) {
        if (this.disabled) {
            return;
        }

        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);
        }

        this.sliderHandleClick = false;
    }

    onHandleKeydown(event, handleIndex?: number) {
        if (this.disabled) {
            return;
        }
        if (event.which == 38 || event.which == 39) {
            this.spin(event, 1, handleIndex);
        } else if (event.which == 37 || event.which == 40) {
            this.spin(event, -1, handleIndex);
        }
    }

    spin(event, dir: number, handleIndex?: number) {
        let step = (this.step || 1) * dir;

        this.updateValue(this.value + step);
        this.updateHandleValue();

        event.preventDefault();
    }

    handleChange(event: Event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }

    handleTouchStartChange(event: TouchEvent) {
        const touchobj = event.changedTouches[0];
        let handleValue = this.calculateHandleValue(touchobj);
        this.setValueFromHandle(event, handleValue);
    }

    bindDragListeners() {
        this.ngZone.runOutsideAngular(() => {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            if (!this.dragListener) {
                this.dragListener = this.renderer.listen(documentTarget, 'mousemove', (event) => {
                    if (this.dragging) {
                        this.ngZone.run(() => {
                            this.handleChange(event);
                        });
                    }
                });
            }

            if (!this.mouseupListener) {
                this.mouseupListener = this.renderer.listen(documentTarget, 'mouseup', (event) => {
                    if (this.dragging) {
                        this.dragging = false;
                        this.ngZone.run(() => {
                            this.onSlideEnd.emit({ originalEvent: event, value: this.value });

                            if (this.animate) {
                                DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
                            }
                        });
                    }
                });
            }
        });
    }

    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
        }

        if (this.mouseupListener) {
            this.mouseupListener();
        }
    }

    setValueFromHandle(event: Event, handleValue: any) {
        this.sliderHandleClick = false;
        let newValue = this.getValueFromHandle(handleValue);

        if (this.step) {
            this.handleStepChange(newValue, this.value);
        } else {
            this.handleValue = handleValue;
            this.updateValue(newValue, event);
        }

        this.cd.markForCheck();
    }

    handleStepChange(newValue: number, oldValue: number) {
        let diff = newValue - oldValue;
        let val = oldValue;

        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / this.step - oldValue / this.step) * this.step;
        } else if (diff > 0) {
            val = oldValue + Math.floor(newValue / this.step - oldValue / this.step) * this.step;
        }

        this.updateValue(val);
        this.updateHandleValue();
    }

    writeValue(value: any): void {
        this.value = value || 0;

        this.updateHandleValue();
        this.updateDiffAndOffset();
        this.cd.markForCheck();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
        this.cd.markForCheck();
    }

    get rangeStartLeft() {
        if (!this.isVertical()) return this.handleValues[0] > 100 ? 100 + '%' : this.handleValues[0] + '%';
        return null;
    }

    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }

    get rangeEndLeft() {
        return this.isVertical() ? null : this.handleValues[1] + '%';
    }

    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }

    isVertical(): boolean {
        return this.orientation === 'vertical';
    }

    updateDomData(): void {
        let rect = this.el.nativeElement.children[0].getBoundingClientRect();
        this.initX = rect.left + DomHandler.getWindowScrollLeft();
        this.initY = rect.top + DomHandler.getWindowScrollTop();
        this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }

    calculateHandleValue(event): number {
        if (this.orientation === 'horizontal') return ((event.pageX - this.initX) * 100) / this.barWidth;
        else return ((this.initY + this.barHeight - event.pageY) * 100) / this.barHeight;
    }

    updateHandleValue(): void {
        if (this.value < this.min) this.handleValue = 0;
        else if (this.value > this.max) this.handleValue = 100;
        else this.handleValue = ((this.value - this.min) * 100) / (this.max - this.min);

        if (this.step) {
            this.updateDiffAndOffset();
        }
    }

    updateDiffAndOffset(): void {
        this.diff = this.getDiff();
        this.offset = this.getOffset();
    }

    getDiff(): number {
        return Math.abs(this.handleValues[0] - this.handleValues[1]);
    }

    getOffset(): number {
        return Math.min(this.handleValues[0], this.handleValues[1]);
    }

    updateValue(val: number, event?: Event): void {
        if (val < this.min) {
            val = this.min;
            this.handleValue = 0;
        } else if (val > this.max) {
            val = this.max;
            this.handleValue = 100;
        }

        this.value = this.getNormalizedValue(val);

        this.onModelChange(this.value);
        this.onChange.emit({ event: event, value: this.value });
        this.sliderHandle.nativeElement.focus();
    }

    getValueFromHandle(handleValue: number): number {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }

    getDecimalsCount(value: number): number {
        if (value && Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;
        return 0;
    }

    getNormalizedValue(val: number): number {
        let decimalsCount = this.getDecimalsCount(this.step);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        } else {
            return Math.floor(val);
        }
    }

    ngOnDestroy() {
        this.unbindDragListeners();
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [SliderAlt],
    declarations: [SliderAlt]
})
export class SliderAltModule {}
