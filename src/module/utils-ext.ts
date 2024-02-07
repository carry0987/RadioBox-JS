import {
    getElem,
    createElem,
    deepMerge,
    injectStylesheet,
    setStylesheetId,
    setReplaceRule,
    generateRandom,
    isEmpty,
    removeStylesheet,
    throwError,
    eventUtils,
} from '@carry0987/utils';
import {
    RadioboxTitleDetail,
    RadioboxTemplate,
    RadioInputElement,
} from '../interface/interfaces';

class Utils {
    static throwError = throwError;
    static getElem = getElem;
    static deepMerge = deepMerge;
    static generateRandom = generateRandom;
    static injectStylesheet = injectStylesheet;
    static removeStylesheet = removeStylesheet;
    static setStylesheetId = setStylesheetId;
    static setReplaceRule = setReplaceRule;
    static isEmpty = isEmpty;
    static createEvent = eventUtils.createEvent;
    static dispatchEvent = eventUtils.dispatchEvent;

    static getTemplate(id: number | string): string {
        id = id.toString();
        let template = `
        <div class="radio-box radio-box-${id}">
            <label class="radio-title"></label>
        </div>
        `;

        return template;
    }

    static handleRadioboxTitle(
        ele: HTMLElement,
        labelSibling: HTMLElement | null
    ): RadioboxTitleDetail {
        let title: string | null = ele.title || ele.dataset.radioboxTitle || null;
        let remainLabel: boolean = false;
        let randomID: string | null = null;
        let isValidLabel: boolean = false;
        let labelToRestore: HTMLLabelElement | undefined;

        if (labelSibling instanceof HTMLLabelElement) {
            const htmlFor = labelSibling.htmlFor;
            const dataRadioFor = labelSibling.dataset.radioFor;
            const dataRadioId = ele.dataset.radioId;
            remainLabel = !isEmpty(ele.id) && htmlFor === ele.id;
            isValidLabel = !isEmpty(ele.id) && dataRadioFor === ele.id;
            if (!isEmpty(dataRadioId) && dataRadioFor === dataRadioId) {
                randomID = isEmpty(ele.id) && isEmpty(htmlFor) ? 'radio-' + generateRandom(6) : null;
                isValidLabel = true;
            }
            if (isValidLabel || remainLabel) {
                labelToRestore = labelSibling.cloneNode(true) as HTMLLabelElement;
                // Prefer the explicitly set title, fall back to text from the label.
                title = title || labelSibling.textContent;
                // Remove the original label
                labelSibling.parentNode!.removeChild(labelSibling);
            }
        }

        return { title, remainLabel, randomID, labelToRestore };
    }

    static insertRadiobox(
        id: string,
        ele: HTMLInputElement,
        randomID: string | null,
        remainLabel: boolean
    ): RadioboxTemplate {
        let template = Utils.getTemplate(id);
        let templateNode = createElem('div');
        templateNode.innerHTML = template.trim();
        let labelNode = getElem<HTMLLabelElement>('label', templateNode) as HTMLLabelElement;
        let cloneEle = ele.cloneNode(true) as RadioInputElement;
        cloneEle.withID = true;
        if (randomID) {
            cloneEle.id = randomID;
            cloneEle.withID = false;
        }
        if (remainLabel === true) {
            labelNode.htmlFor = cloneEle.id;
        }
        if (labelNode.parentNode) {
            labelNode.parentNode.insertBefore(cloneEle, labelNode);
        }
        // Replace the original element with the new one
        ele.parentNode!.replaceChild(templateNode.firstElementChild || templateNode, ele);

        return {cloneEle, templateNode, labelNode};
    }

    static insertRadioboxTitle(
        title: string | null,
        bindLabel: boolean,
        labelNode: HTMLLabelElement,
        cloneEle: HTMLInputElement
    ): void {
        if (!title) {
            labelNode.parentNode!.removeChild(labelNode);
        } else {
            labelNode.textContent = title;
            if (bindLabel === true) {
                labelNode.classList.add('radio-labeled');
                labelNode.addEventListener('click', (e) => {
                    e.preventDefault();
                    cloneEle.click();
                });
            }
        }
    }

    static toggleCheckStatus(ele: HTMLInputElement, checked: boolean): void {
        if (checked) {
            ele.checked = true;
            ele.setAttribute('checked', 'checked');
        } else {
            ele.checked = false;
            ele.removeAttribute('checked');
        }
    }

    static restoreElement(element: RadioInputElement): void {
        if (typeof element.radioBoxChange === 'function') {
            element.removeEventListener('change', element.radioBoxChange);
        }
        if (element.withID === false) {
            element.removeAttribute('id');
        }
        element.radioBoxChange = undefined;
        element.removeAttribute('data-radiobox');
        if (element.parentNode) {
            let parentElement = element.parentNode as HTMLElement;
            parentElement.replaceWith(element);
        }
        let labelNode = element.labelToRestore;
        if (labelNode && labelNode.nodeType === Node.ELEMENT_NODE) {
            element.parentNode?.insertBefore(labelNode, element.nextSibling);
        }
    }
}

Utils.setStylesheetId('radiobox-style');
Utils.setReplaceRule('.radio-box', '.radio-box-');

export default Utils;
