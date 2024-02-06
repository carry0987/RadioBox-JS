interface OnChangeCallback {
    (target: HTMLInputElement | null): void;
}
interface OnLoadCallback {
    (radioBox: any): void;
}
interface RadioBoxOption {
    checked?: string | number;
    onChange?: OnChangeCallback;
    onLoad?: OnLoadCallback;
    bindLabel?: boolean;
    styles?: object;
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
    constructor(element: string | HTMLInputElement, option?: RadioBoxOption);
    private init;
    private injectStyles;
    private setupCallbacks;
    private processRadiobox;
    private updateRadioboxCheckedStatus;
    private updateAllRadioboxesCheckedStatus;
    private radioBoxChange;
    private destroy;
    set onChange(callback: OnChangeCallback);
    empty(): RadioBox;
    refresh(): void;
    static destroyAll(): void;
    /**
     * Get value of the checked radio box
     * @return {string} Value of the checked radio box
     */
    get value(): string | null;
}

export { RadioBox as default };
