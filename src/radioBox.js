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
            //Listen to click events
            element.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                e.target.setAttribute('checked', isChecked ? 'checked' : '');
                this.onChange(e);
            });
        });

        return this;
    }

    /**
     * Destroys the plugin
     */
    destroy() {
        //Remove event listeners
        this.ele.removeEventListener('change', this.onChange);
        //Remove data
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
