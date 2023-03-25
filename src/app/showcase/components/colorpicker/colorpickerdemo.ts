import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

interface ColorPickerFormDemo {
    color: FormControl<string>;
}

@Component({
    templateUrl: './colorpickerdemo.html'
})
export class ColorPickerDemo {
    color1: string;

    color2: string = '#1976D2';

    color3: string = '#000000';

    colorPickerForm = new FormGroup<ColorPickerFormDemo>({
        color: new FormControl('#000000')
    });
}
