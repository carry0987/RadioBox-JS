import Util from './util';
import throwError from './error';
import reportInfo from './report';
import './radioBox.css';

class RadioBox {
    constructor(elem, option = {}) {
        if (!(this instanceof RadioBox)) return new RadioBox(elem, option);
        this.init(elem, option, RadioBox.instance.length);
        this.onChange = (e) => {if (this.option.onChange) this.option.onChange(e)};
        RadioBox.instance.push(this);

        if (RadioBox.instance.length === 1) reportInfo('RadioBox is loaded, version:' + RadioBox.version);
    }

    /**
     * Initializes the plugin
     */
    init(elem, option, id) {
        this.elements = []; // Store all elements here which will be used in destroy function
        let ele = Util.getElem(elem, 'all');
        if (ele.length < 1) throwError('Elements not found');
        let groupName;
        ele.forEach(element => {
            element = Util.getElem('input', null, element);
            if (element.length < 1) throwError('Elements not found');
            element = element[0];
            if (element.type !== 'radio') throwError('Element must be radio');
            if (!groupName) groupName = element.name;
            if (element.name !== groupName) throwError('All radioboxes must belong to the same group');
            element.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                e.target.setAttribute('checked', isChecked ? 'checked' : '');
                this.onChange(e);
            });
            this.elements.push(element); // Store each radio input box
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
        });
        // Remove reference from instance array
        RadioBox.instance.splice(this.id, 1);
        
        return this;
    }
}

RadioBox.version = '1.0.0';
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