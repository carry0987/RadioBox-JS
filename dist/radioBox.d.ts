interface OnChangeCallback {
    (target: HTMLInputElement): void;
}
interface OnLoadCallback {
    (radioBox: any): void;
}
interface RadioBoxOption {
    checked: string | number | null;
    bindLabel: boolean;
    styles: object;
    onChange?: OnChangeCallback;
    onLoad?: OnLoadCallback;
}
interface RadioboxTitleDetail {
    title: string | null;
    remainLabel: boolean;
    randomID: string | null;
    labelToRestore?: HTMLLabelElement;
}
interface RadioboxTemplate {
    cloneEle: RadioInputElement;
    templateNode: HTMLDivElement;
    labelNode: HTMLLabelElement;
}
interface RadioInputElement extends HTMLInputElement {
    withID: boolean;
    radioBoxChange?: EventListener;
    labelToRestore?: HTMLLabelElement;
}

declare class RadioBox {
    private static instances;
    private static version;
    private static firstLoad;
    private element;
    private options;
    private id;
    private allElement;
    private groupName;
    private onChangeCallback?;
    private onLoadCallback?;
    constructor(element: string | HTMLInputElement, option: Partial<RadioBoxOption>);
    private init;
    private injectStyles;
    private setupCallbacks;
    private processRadiobox;
    private updateRadioboxCheckedStatus;
    private updateAllRadioboxesCheckedStatus;
    private radioBoxChange;
    private destroy;
    set onChange(callback: OnChangeCallback);
    /**
     * Set value of the checked radio box
     * @param {string | number} value - Value to set
     */
    set value(value: string | number);
    /**
     * Get all radio box elements
     * @return {RadioInputElement[]} All radio box elements
     */
    get elements(): RadioInputElement[];
    /**
     * Get value of the checked radio box
     * @return {string} Value of the checked radio box
     */
    get value(): string | null;
    setValue(value: number | string): void;
    setChecked(index: number | string): void;
    empty(): RadioBox;
    refresh(): void;
    static destroyAll(): void;
}

export { type OnChangeCallback, type OnLoadCallback, type RadioBoxOption, type RadioInputElement, type RadioboxTemplate, type RadioboxTitleDetail, RadioBox as default };
