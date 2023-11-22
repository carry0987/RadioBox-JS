import domUtils, { getTemplate } from './utils-ext';
import { deepMerge, injectStylesheet, isEmpty, removeStylesheet, errorUtils } from '@carry0987/utils';
import reportInfo from './report';
import './radioBox.css';

class RadioBox {
    constructor(elem, option = {}) {
        this.init(elem, option, RadioBox.instance.length);
        RadioBox.instance.push(this);

        if (RadioBox.instance.length === 1) reportInfo('RadioBox is loaded, version:' + RadioBox.version);
    }

    /**
     * Get value of the checked radio box
     * @return {string} Value of the checked radio box
     */
    get value() {
        let checkedRadio = this.elements.find(element => element.checked);
        return checkedRadio ? checkedRadio.value : null;
    }

    /**
     * Initializes the plugin
     */
    init(elem, option, id) {
        let element = domUtils.getElem(elem, 'all');
        if (element.length < 1) errorUtils.throwError('Elements not found');
        this.id = id;
        this.option = deepMerge({}, RadioBox.defaultOption, option);
        this.elements = []; // Store all elements here which will be used in destroy function
        // Inject stylesheet
        if (this.option?.styles && Object.keys(this.option.styles).length > 0) {
            let styles = deepMerge({}, this.option.styles);
            injectStylesheet(styles, this.id);
        }
        // Handle onChange event
        this.onChange = (e, target) => {if (this.option.onChange) this.option.onChange(e, target)};
        // Handle radio box
        let groupName;
        element.forEach((ele, index) => {
            if (ele.type !== 'radio') errorUtils.throwError('Element must be radio');
            if (ele.hasAttribute('data-radiobox')) return;
            ele.setAttribute('data-radiobox', 'true');
            if (!groupName) groupName = ele.name;
            if (ele.name !== groupName) errorUtils.throwError('All radioboxes must belong to the same group');

            // Handle switch title
            let labelSibling = ele.nextElementSibling;
            let title = ele?.title || ele?.dataset?.radioTitle;
            let bindLabel = this.option.bindLabel;
            let ramainLabel = false;
            if (labelSibling && labelSibling.tagName === 'LABEL') {
                title = (() => { // using IIFE
                    if (!isEmpty(ele.id)) {
                        if (labelSibling.htmlFor === ele.id) {
                            bindLabel = ramainLabel = true;
                            return true;
                        }
                        if (labelSibling.dataset?.radioFor === ele.id) {
                            return true;
                        }
                    }
                    if (ele.dataset?.radioId && labelSibling.dataset?.radioFor === ele.dataset?.radioId) {
                        return true;
                    }
                    return null;
                })();
                if (title === true) {
                    title = labelSibling.textContent;
                    labelSibling.parentNode.removeChild(labelSibling);
                }
            }

            // Handle radio checked
            if ((this.option.checked && ele?.value === this.option.checked) || (index === this.option?.checked)) {
                // Remove checked attribute from other radio boxes
                element.forEach(el => el !== ele && (el.checked = false, el.removeAttribute('checked')));
                ele.checked = true;
                ele.setAttribute('checked', 'checked');
            }

            // Insert radio box
            let template = getTemplate(this.id);
            let templateNode = document.createElement('div');
            templateNode.innerHTML = template.trim();
            let labelNode = domUtils.getElem('label', templateNode);
            let cloneEle = ele.cloneNode(true);
            if (ramainLabel === true) {
                labelNode.htmlFor = ele.id;
            }
            labelNode.parentNode.insertBefore(cloneEle, labelNode);
            ele.parentNode.replaceChild(templateNode.firstElementChild, ele);

            // Insert radio title
            if (title === null) {
                labelNode.parentNode.removeChild(labelNode);
            } else {
                labelNode.textContent = title;
                if (bindLabel) {
                    labelNode.classList.add('radio-labeled');
                    labelNode.addEventListener('click', (e) => {
                        e.preventDefault();
                        cloneEle.click();
                    });
                }
            }

            // Add event listener
            cloneEle.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                this.elements.forEach(el => {
                    if (el !== e.target) el.removeAttribute('checked');
                });
                e.target.setAttribute('checked', isChecked ? 'checked' : '');
                this.onChange(e, cloneEle);
            });
            this.elements.push(cloneEle); // Store each radio input box
        });

        // Handle radio loaded
        if (this.option.loaded) this.option.loaded(this);

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
        removeStylesheet(this.id);
        // Remove reference from instance array
        RadioBox.instance.splice(this.id, 1);
        
        return this;
    }
}

RadioBox.version = '__version__';
RadioBox.instance = [];
RadioBox.defaultOption = {
    checked: null,
    loaded: null,
    onChange: null,
    bindLabel: true,
    styles: {}
};
RadioBox.destroyAll = () => {
    RadioBox.instance.forEach((item, index) => {
        item.destroy();
    });
    RadioBox.instance = [];
};

export default RadioBox;
