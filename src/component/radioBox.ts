import { defaults } from '@/component/config';
import Utils from '@/module/utils-ext';
import reportInfo from '@/module/report';
import { OnChangeCallback, OnLoadCallback, RadioBoxOption, RadioInputElement } from '@/interface/interfaces';
import { InputElement } from '@/type/types';

class RadioBox {
    private static instances: RadioBox[] = [];
    private static version: string = '__version__';
    private static firstLoad: boolean = true;
    private element: InputElement = null;
    private options: RadioBoxOption = defaults;
    private id: number = 0;
    private allElement: RadioInputElement[] = [];
    private groupName: string = '';

    // Methods for external use
    private onChangeCallback?: OnChangeCallback;
    private onLoadCallback?: OnLoadCallback;

    constructor(element: InputElement, option: Partial<RadioBoxOption>) {
        this.init(element, option, RadioBox.instances.length);
        RadioBox.instances.push(this);

        if (RadioBox.instances.length === 1 && RadioBox.firstLoad === true) {
            reportInfo(`RadioBox is loaded, version: ${RadioBox.version}`);
        }

        // Set firstLoad flag to false
        RadioBox.firstLoad = false;
    }

    private init(elements: InputElement, option: Partial<RadioBoxOption>, id: number) {
        let elem: NodeListOf<HTMLInputElement> | Array<HTMLInputElement> | null = null;
        if (typeof elements === 'string') {
            elem = Utils.getElem<HTMLInputElement>(elements, 'all');
        } else if (elements instanceof NodeList || elements instanceof Array) {
            elem = elements;
        } else if (elements instanceof HTMLInputElement) {
            elem = [elements];
        }
        if (!elem) return Utils.throwError('Cannot find elements : ' + elements);
        this.id = id;
        this.element = elements;
        this.options = Utils.deepMerge({} as RadioBoxOption, defaults, option);

        // Inject stylesheet
        this.injectStyles();

        // Handle callback events
        this.setupCallbacks();

        // Process each radiobox element
        elem.forEach((ele, index) => this.processRadiobox(ele, index));

        // Handle radio loaded event
        this.onLoadCallback?.(this);

        return this;
    }

    private injectStyles(): void {
        // Inject stylesheet
        let styles = {};
        if (this.options?.styles && Object.keys(this.options.styles).length > 0) {
            styles = Utils.deepMerge({}, this.options.styles, styles);
        }
        styles && Utils.injectStylesheet(styles, this.id.toString());
    }

    private setupCallbacks(): void {
        // Handle onChange event
        this.onChange = (target) => {
            if (this.options?.onChange) this.options.onChange(target);
        };
        // Handle onLoad event
        this.onLoadCallback = this.options?.onLoad;
    }

    private processRadiobox(ele: HTMLInputElement, index: number): void {
        if (ele.type !== 'radio') return;
        if (ele.hasAttribute('data-radiobox')) return;
        ele.setAttribute('data-radiobox', 'true');
        if (Utils.isEmpty(this.groupName)) this.groupName = ele.name;
        if (ele.name !== this.groupName) Utils.throwError('All radioboxes must belong to the same group');

        // Handle radiobox title
        let labelSibling = ele.nextElementSibling as HTMLElement;
        let bindLabel = this.options.bindLabel ?? false;
        let { title, remainLabel, randomID, labelToRestore } = Utils.handleRadioboxTitle(ele, labelSibling);
        bindLabel = remainLabel ? true : bindLabel;

        // Handle radiobox checked status
        if (this.options.checked || ele.checked) {
            // Initialize radiobox checked status based on options
            this.updateRadioboxCheckedStatus(ele, index);
        }

        // Insert radiobox
        let { cloneEle, labelNode } = Utils.insertRadiobox(this.id.toString(), ele, randomID, remainLabel);

        // Insert radiobox title
        Utils.insertRadioboxTitle(title, bindLabel, labelNode, cloneEle);

        // Add event listener
        let radioBoxChange = this.radioBoxChange.bind(this, cloneEle);
        cloneEle.addEventListener('change', radioBoxChange);
        cloneEle.radioBoxChange = radioBoxChange;
        this.allElement.push(cloneEle);

        // Store label
        cloneEle.labelToRestore = labelToRestore;
    }

    private updateRadioboxCheckedStatus(ele: HTMLInputElement, index: number): void {
        // Logic to determine if a radiobox should be checked based on the provided options
        const checked = this.options.checked;
        if (
            (typeof checked === 'string' && ele.value === checked) ||
            (typeof checked === 'number' && index === checked)
        ) {
            // Remove checked attribute from other radio boxes
            this.allElement.forEach((el) => el !== ele && Utils.toggleCheckStatus(el, false));
            Utils.toggleCheckStatus(ele, true);
            return;
        }

        if (ele.checked && Utils.validRadioBoxStatus(this.allElement)) {
            Utils.toggleCheckStatus(ele, true);
            return;
        }
    }

    private updateAllRadioboxesCheckedStatus(selectedEle: HTMLInputElement, selectedIndex: number): void {
        // When a radiobox is checked manually, ensure only one radiobox is checked at a time
        this.allElement.forEach((ele, index) => {
            const shouldBeChecked = ele === selectedEle || selectedIndex === index;
            Utils.toggleCheckStatus(ele, shouldBeChecked);
        });
    }

    private radioBoxChange(target: RadioInputElement): void {
        this.onChangeCallback?.(target);
        if (target) {
            this.updateAllRadioboxesCheckedStatus(target, this.allElement.indexOf(target));
        }
    }

    private destroy(): void {
        // Reset firstLoad flag
        RadioBox.firstLoad = false;
        // Remove event listeners from all elements
        this.allElement.forEach((element) => {
            Utils.restoreElement(element);
        });

        // Reset instance variables
        this.element = null;
        this.options = defaults;
        this.allElement = [];

        // Remove any injected stylesheets
        Utils.removeStylesheet(this.id.toString());

        // Update the static instances array, removing this instance
        const index = RadioBox.instances.indexOf(this);
        if (index !== -1) {
            RadioBox.instances.splice(index, 1);
        }
    }

    // Methods for external use
    public set onChange(callback: OnChangeCallback) {
        this.onChangeCallback = callback;
    }

    /**
     * Set value of the checked radio box
     * @param {string | number} value - Value to set
     */
    public set value(value: string | number) {
        this.setValue(value);
    }

    /**
     * Get all radio box elements
     * @return {RadioInputElement[]} All radio box elements
     */
    public get elements(): RadioInputElement[] {
        return this.allElement;
    }

    /**
     * Get value of the checked radio box
     * @return {string} Value of the checked radio box
     */
    public get value(): string | null {
        let checkedRadio = this.allElement.find((element) => element.checked);

        return checkedRadio ? checkedRadio.value : null;
    }

    public setValue(value: number | string): void {
        value = value.toString();
        this.allElement.forEach((element) => {
            const shouldBeChecked = element.value === value;
            if (shouldBeChecked && !element.checked) {
                element.checked = true;
                this.radioBoxChange(element);
            }
        });
    }

    public setChecked(index: number | string): void {
        this.allElement.forEach((element, idx) => {
            const shouldBeChecked =
                (typeof index === 'number' && index === idx) || (typeof index === 'string' && element.value === index);
            if (shouldBeChecked && !element.checked) {
                element.checked = true;
                this.radioBoxChange(element);
            }
        });
    }

    public empty(): RadioBox {
        this.allElement.forEach((element) => {
            element.checked = false;
            element.removeAttribute('checked');
        });
        this.allElement = [];

        return this;
    }

    public refresh(): void {
        // Re-initialize the current instance
        if (this.element) {
            this.init(this.element, this.options, this.id);
        }
    }

    public static destroyAll(): void {
        // Call destroy on all instances
        while (RadioBox.instances.length) {
            const instance = RadioBox.instances[0];
            instance.destroy();
        }
    }
}

export { RadioBox };
