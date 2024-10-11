# RadioBox-JS
[![version](https://img.shields.io/npm/v/@carry0987/radio-box.svg)](https://www.npmjs.com/package/@carry0987/radio-box)
![CI](https://github.com/carry0987/RadioBox-JS/actions/workflows/ci.yml/badge.svg)  
A library for create radio type checkbox

## Installation
```bash
pnpm i @carry0987/radio-box
```

## Usage
Here is a simple example to use RadioBox-JS

#### UMD
```html
<div id="app">
    <h1>Normal Radio Input (With label)</h1>
    <input type="radio" name="radio-normal" id="radio-1" value="Test-1">
    <label for="radio-1">Radio-1</label>
    <input type="radio" name="radio-normal" id="radio-2" value="Test-2" checked>
    <label for="radio-2">Radio-2</label>
</div>
<div id="app-2">
    <h1>Other Radio Input</h1>
    <input type="radio" name="radio-other" title="Radio-3" value="Test-3">
    <input type="radio" name="radio-other" id="radio-4" value="Test-4">
    <label data-radio-for="radio-4">Radio-4</label>
    <input type="radio" name="radio-other" value="Test-5" data-radio-id="radio-5">
    <label data-radio-for="radio-5">Radio-5</label>
</div>
<script src="dist/radioBox.min.js"></script>
<script type="text/javascript">
let radioBox = new radioBoxjs.RadioBox('#app input', {
    styles: {
        '.radio-box': {
            'margin-bottom': '5px'
        }
    },
    onChange: (target) => {
        console.log(target);
    }
});
console.log(radioBox.value);
radioBox.value = 'Test-1';

let radioBox2 = new radioBoxjs.RadioBox('#app-2 input', {
    checked: 1, // You can use index or value
    bindLabel: false,
    styles: {
        '.radio-box': {
            'margin-bottom': '10px'
        }
    },
    onLoad: (radioBox) => {
        console.log(radioBox.value);
    }
});
radioBox2.onChange = (target) => {
    console.log(target.value);
};
</script>
```

#### ES Module
```ts
import { RadioBox } from '@carry0987/radio-box';
import '@carry0987/radio-box/theme/radioBox.min.css';

let radioBox = new RadioBox('#app input', {
    //...
});
```
