import Util from './util';
import throwError from './error';
import reportInfo from './report';
import './radioBox.css';

class RadioBox {
    constructor(elem, option = {}) {
        if (!(this instanceof RadioBox)) return new RadioBox(elem, option);
        this.init(elem, option, RadioBox.instance.length);
        RadioBox.instance.push(this);

        if (RadioBox.instance.length === 1) reportInfo('RadioBox is loaded, version:' + RadioBox.version);
    }

    /**
     * Get value of the checked radio box
     * @return {string} Value of the checked radio box
     */
    get value() {
        let checkedRadio = this.elements.find(element => element.getAttribute('checked') === 'checked');
        return checkedRadio ? checkedRadio.value : null;
    }

    /**
     * Initializes the plugin
     */
    init(elem, option, id) {
        this.id = id;
        this.option = Util.deepMerge(RadioBox.defaultOption, option);
        this.elements = []; // Store all elements here which will be used in destroy function
        let ele = Util.getElem(elem, 'all');
        if (ele.length < 1) throwError('Elements not found');
        let groupName, element;
        this.onChange = (e) => {if (this.option.onChange) this.option.onChange(e)};
        ele.forEach(elem => {
            element = Util.getElem('input', null, elem);
            if (element.length < 1) throwError('Elements not found');
            element = element[0];
            if (element.type !== 'radio') throwError('Element must be radio');
            if (!groupName) groupName = element.name;
            if (element.name !== groupName) throwError('All radioboxes must belong to the same group');
            // Set checked
            if (this.option.checked && element.value === this.option.checked) {
                element.checked = true;
                element.setAttribute('checked', 'checked');
            }
            // Add event listener
            element.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                this.elements.forEach(el => {
                    if(el !== e.target) el.removeAttribute('checked');
                });
                e.target.setAttribute('checked', isChecked ? 'checked' : '');
                this.onChange(e);
            });
            this.elements.push(element); // Store each radio input box
        });

        return this;
    }

    empty() {
        this.elements.forEach(element => {
            element.checked = false;
            element.removeAttribute('checked');
        });
        return this;
    }

    /**
     * Destroys the plugin
     */
    destroy() {
        //Remove event listeners from all elements
        this.elements.forEach(element => {
            element.removeEventListener('change', this.onChange);
            element.removeEventListener('change', this.option.onChange);
        });
        // Remove reference from instance array
        RadioBox.instance.splice(this.id, 1);
        
        return this;
    }
}

RadioBox.version = '1.3.2';
RadioBox.instance = [];
RadioBox.defaultOption = {
    checked: null,
    onChange: null,
};
RadioBox.destroyAll = () => {
    RadioBox.instance.forEach((item, index) => {
        item.destroy();
    });
    RadioBox.instance = [];
};

export default RadioBox;
