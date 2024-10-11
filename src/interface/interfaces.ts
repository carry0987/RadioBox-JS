import { RadioBox } from '@/component/radioBox';

export interface OnChangeCallback {
    (target: HTMLInputElement): void;
}

export interface OnLoadCallback {
    (radioBox: RadioBox): void;
}

export interface RadioBoxOption {
    checked: string | number | null;
    bindLabel: boolean;
    styles: object;
    onChange?: OnChangeCallback;
    onLoad?: OnLoadCallback;
}

export interface RadioboxTitleDetail {
    title: string | null;
    remainLabel: boolean;
    randomID: string | null;
    labelToRestore?: HTMLLabelElement;
}

export interface RadioboxTemplate {
    cloneEle: RadioInputElement;
    templateNode: HTMLDivElement;
    labelNode: HTMLLabelElement;
}

export interface RadioInputElement extends HTMLInputElement {
    withID: boolean;
    radioBoxChange?: EventListener;
    labelToRestore?: HTMLLabelElement;
}
