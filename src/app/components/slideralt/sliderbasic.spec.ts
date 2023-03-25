import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SliderAlt } from './slideralt';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SliderAlt', () => {
    let slideralt: SliderAlt;
    let fixture: ComponentFixture<SliderAlt>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [SliderAlt]
        });

        fixture = TestBed.createComponent(SliderAlt);
        slideralt = fixture.componentInstance;
    });

    it('should created by default', () => {
        fixture.detectChanges();

        const slideraltEl = fixture.debugElement.query(By.css('div')).nativeElement;
        expect(slideraltEl).toBeTruthy();
    });

    it('should disabled', () => {
        slideralt.disabled = true;
        fixture.detectChanges();

        const slideraltEl = fixture.debugElement.query(By.css('div')).nativeElement;
        const clickSpy = spyOn(slideralt, 'updateDomData').and.callThrough();
        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        slideraltEl.click();
        fixture.detectChanges();

        expect(slideraltEl.className).toContain('p-disabled');
        expect(clickSpy).not.toHaveBeenCalled();
        expect(slideralt.dragging).not.toEqual(true);
    });

    it('should animate', () => {
        slideralt.animate = true;
        fixture.detectChanges();

        const slideraltEl = fixture.debugElement.query(By.css('div')).nativeElement;
        slideraltEl.click();
        expect(slideraltEl.className).toContain('p-slideralt-animate');
    });

    it('should change styles', () => {
        slideralt.style = { height: '300px' };
        slideralt.styleClass = 'Primeng ROCKS!';
        fixture.detectChanges();

        const slideraltEl = fixture.debugElement.query(By.css('div')).nativeElement;
        expect(slideraltEl.className).toContain('Primeng ROCKS!');
        expect(slideraltEl.style.height).toEqual('300px');
    });

    it('should change orientation', () => {
        slideralt.orientation = 'vertical';
        fixture.detectChanges();

        const slideraltEl = fixture.debugElement.query(By.css('div')).nativeElement;
        expect(slideraltEl.className).toContain('p-slideralt-vertical');
    });

    it('should set min', () => {
        slideralt.min = 20;
        fixture.detectChanges();

        slideralt.updateValue(19);
        fixture.detectChanges();

        slideralt.cd.detectChanges();
        const spanEl = fixture.debugElement.query(By.css('span')).nativeElement;
        expect(slideralt.handleValue).toEqual(0);
        expect(spanEl.style.width).toEqual('0%');
    });

    it('should set max', () => {
        slideralt.max = 90;
        fixture.detectChanges();

        slideralt.updateValue(91);
        fixture.detectChanges();

        slideralt.cd.detectChanges();
        const spanEl = fixture.debugElement.query(By.css('span')).nativeElement;
        expect(slideralt.handleValue).toEqual(100);
        expect(spanEl.style.width).toEqual('100%');
    });

    it('should listen onChange', () => {
        fixture.detectChanges();

        let value = 1;
        slideralt.onChange.subscribe((data) => (value = data.value));
        slideralt.updateValue(91);
        fixture.detectChanges();

        expect(value).toEqual(91);
    });

    it('should change value with touch events (horizontal)', () => {
        fixture.detectChanges();

        slideralt.updateValue(91);
        slideralt.handleValue = 91;
        fixture.detectChanges();

        const touchstartEvent: any = document.createEvent('CustomEvent');
        touchstartEvent.changedTouches = [
            {
                clientX: 450
            }
        ];
        touchstartEvent.initEvent('touchstart', true, true);
        const touchmoveEvent: any = document.createEvent('CustomEvent');
        touchmoveEvent.changedTouches = [
            {
                clientX: 400
            }
        ];
        touchmoveEvent.initEvent('touchmove', true, true);
        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(touchstartEvent);
        fixture.detectChanges();

        spanEl.nativeElement.dispatchEvent(touchmoveEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeLessThan(91);
    });

    it('should change value with touch events (vertical)', () => {
        fixture.detectChanges();

        slideralt.orientation = 'vertical';
        slideralt.updateValue(91);
        slideralt.handleValue = 91;
        fixture.detectChanges();

        const touchstartEvent: any = document.createEvent('CustomEvent');
        touchstartEvent.changedTouches = [
            {
                clientY: 400
            }
        ];
        touchstartEvent.initEvent('touchstart', true, true);
        const touchmoveEvent: any = document.createEvent('CustomEvent');
        touchmoveEvent.changedTouches = [
            {
                clientY: 450
            }
        ];
        touchmoveEvent.initEvent('touchmove', true, true);
        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(touchstartEvent);
        fixture.detectChanges();

        spanEl.nativeElement.dispatchEvent(touchmoveEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeLessThan(91);
    });

    it('should change value with mouse events (horizontal)', () => {
        fixture.detectChanges();

        const bindDragListenersSpy = spyOn(slideralt, 'bindDragListeners').and.callThrough();
        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        fixture.detectChanges();

        expect(bindDragListenersSpy).toHaveBeenCalled();
        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeGreaterThan(0);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(false);
        const unbindDragListenersSpy = spyOn(slideralt, 'unbindDragListeners').and.callThrough();
        slideralt.ngOnDestroy();
        fixture.detectChanges();

        expect(unbindDragListenersSpy).toHaveBeenCalled();
    });

    it('should change value with mouse events (vertical)', () => {
        slideralt.orientation = 'vertical';
        fixture.detectChanges();

        const bindDragListenersSpy = spyOn(slideralt, 'bindDragListeners').and.callThrough();
        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        fixture.detectChanges();

        expect(bindDragListenersSpy).toHaveBeenCalled();
        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageY = 115;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeGreaterThan(0);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(false);
        const unbindDragListenersSpy = spyOn(slideralt, 'unbindDragListeners').and.callThrough();
        slideralt.ngOnDestroy();
        fixture.detectChanges();

        expect(unbindDragListenersSpy).toHaveBeenCalled();
    });

    it('should increment value with step', () => {
        slideralt.value = 0;
        slideralt.step = 2;
        fixture.detectChanges();

        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeGreaterThan(0);
        expect(slideralt.value % 2).toEqual(0);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(false);
        slideralt.ngOnDestroy();
        fixture.detectChanges();
    });

    it('should increment value with decimal step and decimal max', () => {
        slideralt.value = 0.02;
        slideralt.step = 0.01;
        slideralt.max = 2.5;
        fixture.detectChanges();

        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeGreaterThan(0.02);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(false);
        slideralt.ngOnDestroy();
        fixture.detectChanges();
    });

    it('should decrement value with step', () => {
        slideralt.value = 90;
        slideralt.step = 2;
        fixture.detectChanges();

        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeGreaterThan(0);
        expect(slideralt.value % 2).toEqual(0);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(false);
        slideralt.ngOnDestroy();
        fixture.detectChanges();
    });

    it('should decrement value with decimal step and decimal max', () => {
        slideralt.value = 2.4;
        slideralt.step = 0.01;
        slideralt.max = 2.5;
        fixture.detectChanges();

        const spanEl = fixture.debugElement.query(By.css('.p-slideralt-handle'));
        spanEl.nativeElement.dispatchEvent(new Event('mousedown'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.value).toBeGreaterThan(0);
        expect(slideralt.value).toBeLessThan(2.4);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();

        expect(slideralt.dragging).toEqual(false);
        slideralt.ngOnDestroy();
        fixture.detectChanges();
    });

    it('should select range', () => {
        slideralt.handleValues = [20, 80];
        slideralt.values = [20, 80];
        slideralt.style = { width: '600px' };
        fixture.detectChanges();

        const slideraltHandlers = fixture.debugElement.queryAll(By.css('.p-slideralt-handle'));
        const firstSliderAltHandler = slideraltHandlers[0];
        firstSliderAltHandler.nativeElement.dispatchEvent(new Event('mousedown'));
        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.values[0]).toBeGreaterThan(20);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();
    });

    it('should select range with step', () => {
        slideralt.step = 2;
        slideralt.handleValues = [20, 80];
        slideralt.style = { width: '600px' };
        slideralt.values = [20, 80];
        fixture.detectChanges();

        const slideraltHandlers = fixture.debugElement.queryAll(By.css('.p-slideralt-handle'));
        const firstSliderAltHandler = slideraltHandlers[0];
        firstSliderAltHandler.nativeElement.dispatchEvent(new Event('mousedown'));
        expect(slideralt.dragging).toEqual(true);
        const mousemoveEvent: any = document.createEvent('CustomEvent');
        mousemoveEvent.pageX = 300;
        mousemoveEvent.initEvent('mousemove', true, true);
        document.dispatchEvent(mousemoveEvent as MouseEvent);
        fixture.detectChanges();

        expect(slideralt.values[0]).toBeGreaterThan(20);
        expect(slideralt.values[0] % 2).toEqual(0);
        document.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();
    });
});
