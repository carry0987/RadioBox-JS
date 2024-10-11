interface OnChangeCallback {
    (target: HTMLInputElement): void;
}
interface OnLoadCallback {
    (radioBox: RadioBox): void;
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

type interfaces_OnChangeCallback = OnChangeCallback;
type interfaces_OnLoadCallback = OnLoadCallback;
type interfaces_RadioBoxOption = RadioBoxOption;
type interfaces_RadioInputElement = RadioInputElement;
type interfaces_RadioboxTemplate = RadioboxTemplate;
type interfaces_RadioboxTitleDetail = RadioboxTitleDetail;
declare namespace interfaces {
  export type { interfaces_OnChangeCallback as OnChangeCallback, interfaces_OnLoadCallback as OnLoadCallback, interfaces_RadioBoxOption as RadioBoxOption, interfaces_RadioInputElement as RadioInputElement, interfaces_RadioboxTemplate as RadioboxTemplate, interfaces_RadioboxTitleDetail as RadioboxTitleDetail };
}

type InputElement = string | HTMLInputElement | Array<HTMLInputElement> | NodeListOf<HTMLInputElement> | null;

type types_InputElement = InputElement;
declare namespace types {
  export type { types_InputElement as InputElement };
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
    constructor(element: InputElement, option: Partial<RadioBoxOption>);
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

export { RadioBox, interfaces as RadioBoxInterface, types as RadioBoxType };
