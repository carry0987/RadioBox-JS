function reportError(...error) {
    console.error(...error);
}
function throwError(message) {
    throw new Error(message);
}

function getElem(ele, mode, parent) {
    // Return generic Element type or NodeList
    if (typeof ele !== 'string')
        return ele;
    let searchContext = document;
    if (mode === null && parent) {
        searchContext = parent;
    }
    else if (mode && mode instanceof Node && 'querySelector' in mode) {
        searchContext = mode;
    }
    else if (parent && parent instanceof Node && 'querySelector' in parent) {
        searchContext = parent;
    }
    // If mode is 'all', search for all elements that match, otherwise, search for the first match
    // Casting the result as E or NodeList
    return mode === 'all' ? searchContext.querySelectorAll(ele) : searchContext.querySelector(ele);
}
function createElem(tagName, attrs = {}, text = '') {
    let elem = document.createElement(tagName);
    for (let attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
            if (attr === 'textContent' || attr === 'innerText') {
                elem.textContent = attrs[attr];
            }
            else {
                elem.setAttribute(attr, attrs[attr]);
            }
        }
    }
    if (text)
        elem.textContent = text;
    return elem;
}

let stylesheetId = 'utils-style';
const replaceRule = {
    from: '.utils',
    to: '.utils-'
};
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
}
function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceKey = key;
                const value = source[sourceKey];
                const targetKey = key;
                if (isObject(value)) {
                    if (!target[targetKey] || typeof target[targetKey] !== 'object') {
                        target[targetKey] = {};
                    }
                    deepMerge(target[targetKey], value);
                }
                else {
                    target[targetKey] = value;
                }
            }
        }
    }
    return deepMerge(target, ...sources);
}
function setStylesheetId(id) {
    stylesheetId = id;
}
function setReplaceRule(from, to) {
    replaceRule.from = from;
    replaceRule.to = to;
}
// CSS Injection
function injectStylesheet(stylesObject, id = null) {
    id = isEmpty(id) ? '' : id;
    // Create a style element
    let style = createElem('style');
    // WebKit hack
    style.id = stylesheetId + id;
    style.textContent = '';
    // Add the style element to the document head
    document.head.append(style);
    let stylesheet = style.sheet;
    for (let selector in stylesObject) {
        if (stylesObject.hasOwnProperty(selector)) {
            compatInsertRule(stylesheet, selector, buildRules(stylesObject[selector]), id);
        }
    }
}
function buildRules(ruleObject) {
    let ruleSet = '';
    for (let [property, value] of Object.entries(ruleObject)) {
        property = property.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
        ruleSet += `${property}:${value};`;
    }
    return ruleSet;
}
function compatInsertRule(stylesheet, selector, cssText, id = null) {
    id = isEmpty(id) ? '' : id;
    let modifiedSelector = selector.replace(replaceRule.from, replaceRule.to + id);
    stylesheet.insertRule(modifiedSelector + '{' + cssText + '}', 0);
}
function removeStylesheet(id = null) {
    const styleId = isEmpty(id) ? '' : id;
    let styleElement = getElem('#' + stylesheetId + styleId);
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }
}
function isEmpty(str) {
    if (typeof str === 'number') {
        return false;
    }
    return !str || (typeof str === 'string' && str.length === 0);
}
function generateRandom(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

function addEventListener(...params) {
    const [element, eventName, handler, options] = params;
    element.addEventListener(eventName, handler, options);
}
function removeEventListener(...params) {
    const [element, eventName, handler, options] = params;
    element.removeEventListener(eventName, handler, options);
}
function createEvent(eventName, detail, options) {
    return new CustomEvent(eventName, { detail, ...options });
}
function dispatchEvent(eventOrName, element = document, detail, options) {
    try {
        if (typeof eventOrName === 'string') {
            let event = createEvent(eventOrName, detail, options);
            return element.dispatchEvent(event);
        }
        else if (eventOrName instanceof Event) {
            return element.dispatchEvent(eventOrName);
        }
        else {
            throwError('Invalid event type');
        }
    }
    catch (e) {
        reportError('Dispatch Event Error:', e);
        return false;
    }
}

var eventUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addEventListener: addEventListener,
    createEvent: createEvent,
    dispatchEvent: dispatchEvent,
    removeEventListener: removeEventListener
});

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
    static getTemplate(id) {
        id = id.toString();
        let template = `
        <div class="radio-box radio-box-${id}">
            <label class="radio-title"></label>
        </div>
        `;
        return template;
    }
    static handleRadioboxTitle(ele, labelSibling) {
        let title = ele.title || ele.dataset.radioboxTitle || null;
        let remainLabel = false;
        let randomID = null;
        let isValidLabel = false;
        let labelToRestore;
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
                labelToRestore = labelSibling.cloneNode(true);
                // Prefer the explicitly set title, fall back to text from the label.
                title = title || labelSibling.textContent;
                // Remove the original label
                labelSibling.parentNode.removeChild(labelSibling);
            }
        }
        return { title, remainLabel, randomID, labelToRestore };
    }
    static insertRadiobox(id, ele, randomID, remainLabel) {
        let template = Utils.getTemplate(id);
        let templateNode = createElem('div');
        templateNode.innerHTML = template.trim();
        let labelNode = getElem('label', templateNode);
        let cloneEle = ele.cloneNode(true);
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
        ele.parentNode.replaceChild(templateNode.firstElementChild || templateNode, ele);
        return { cloneEle, templateNode, labelNode };
    }
    static insertRadioboxTitle(title, bindLabel, labelNode, cloneEle) {
        if (!title) {
            labelNode.parentNode.removeChild(labelNode);
        }
        else {
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
    static toggleCheckStatus(ele, checked) {
        if (checked) {
            ele.checked = true;
            ele.setAttribute('checked', 'checked');
        }
        else {
            ele.checked = false;
            ele.removeAttribute('checked');
        }
    }
    static restoreElement(element) {
        if (typeof element.radioBoxChange === 'function') {
            element.removeEventListener('change', element.radioBoxChange);
        }
        if (element.withID === false) {
            element.removeAttribute('id');
        }
        element.radioBoxChange = undefined;
        element.removeAttribute('data-radiobox');
        if (element.parentNode) {
            let parentElement = element.parentNode;
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

const reportInfo = (vars, showType = false) => {
    if (showType === true) {
        console.log('Data Type : ' + typeof vars, '\nValue : ' + vars);
    }
    else if (typeof showType !== 'boolean') {
        console.log(showType);
    }
    else {
        console.log(vars);
    }
};

const defaults = {
    checked: undefined,
    onChange: undefined,
    onLoad: undefined,
    bindLabel: true,
    styles: {}
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* Radio */\n.radio-box {\n    display: flex;\n    align-items: center;\n}\n\n.radio-box input[type=radio] {\n    --active: #275EFE;\n    --active-inner: #f4f4f4;\n    --border: #b4b4b4;\n    --border-hover: #b4b4b4;\n    --background: #f4f4f4;\n    --disabled: #f4f4f4;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    height: 24px;\n    width: 24px;\n    outline: none;\n    display: inline-block;\n    text-align: center;\n    position: relative;\n    margin: 0;\n    cursor: pointer;\n    border: 1px solid var(--bc, var(--border));\n    background: var(--b, var(--background));\n    transition: background 300ms, border-color 300ms, box-shadow 300ms;\n}\n\n.radio-box input[type=radio]:after {\n    content: \"\";\n    display: block;\n    left: -3.5px;\n    top: -3.5px;\n    position: absolute;\n    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s);\n}\n\n.radio-box input[type=radio]:checked {\n    --b: #F4F4F4;\n    --d-o: .3s;\n    --d-t: .6s;\n    --d-t-e: cubic-bezier(.2, .85, .32, 1.2);\n}\n\n.radio-box input[type=radio]:disabled {\n    --b: var(--disabled);\n    cursor: not-allowed;\n    opacity: 0.7;\n}\n\n.radio-box input[type=radio]:disabled:checked {\n    --b: var(--disabled-inner);\n    --bc: var(--border);\n}\n\n.radio-box input[type=radio]:disabled:not(:checked):after {\n    background-color: #f4f4f4;\n}\n\n.radio-box input[type=radio]:disabled:checked:after {\n    background-color: #b4b4b4;\n}\n\n.radio-box input[type=radio]:focus {\n    outline: none;\n    border-color: #3197EE;\n}\n\n.radio-box input[type=radio]:disabled+label {\n    cursor: not-allowed;\n}\n\n.radio-box input[type=radio]:disabled+span {\n    cursor: not-allowed;\n}\n\n.radio-box input[type=radio]:hover:not(:checked):not(:disabled) {\n    --bc: var(--border-hover);\n}\n\n.radio-box input[type=radio]:focus {\n    box-shadow: 0 0 0 #f4f4f4;\n}\n\n.radio-box input[type=radio]:not(.switch):after {\n    opacity: 1;\n}\n\n.radio-box label.radio-labeled,\n.radio-box input[type=radio]+label {\n    display: inline-block;\n    vertical-align: top;\n    margin-left: 4px;\n    line-height: 1;\n}\n\n.radio-box label.radio-labeled {\n    cursor: pointer;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n.radio-box input[type=radio] {\n    border-radius: 50%;\n}\n\n.radio-box input[type=radio]:after {\n    width: 28px;\n    height: 28px;\n    border-radius: 50%;\n    background: var(--active-inner);\n    opacity: 0;\n    transform: scale(var(--s, 0.7));\n}\n\n.radio-box input[type=radio]:checked {\n    --s: 0.575;\n}\n\n.radio-box input[type=radio]:checked:after {\n    background-color: #3197EE;\n    top: -3px;\n    left: -3px;\n}\n\n.radio-inline {\n    margin: 0.5rem;\n    display: inline-block;\n}\n";
styleInject(css_248z);

class RadioBox {
    static instances = [];
    static version = '2.0.2';
    static firstLoad = true;
    element = null;
    options;
    id = 0;
    allElement = [];
    groupName = '';
    // Methods for external use
    onChangeCallback;
    onLoadCallback;
    constructor(element, option = {}) {
        this.init(element, option, RadioBox.instances.length);
        RadioBox.instances.push(this);
        if (RadioBox.instances.length === 1 && RadioBox.firstLoad === true) {
            reportInfo(`RadioBox is loaded, version: ${RadioBox.version}`);
        }
        // Set firstLoad flag to false
        RadioBox.firstLoad = false;
    }
    init(elements, option, id) {
        let elem = Utils.getElem(elements, 'all');
        if (!elem || elem.length < 1)
            Utils.throwError('Cannot find elements : ' + elements);
        this.id = id;
        this.element = elements;
        this.options = Utils.deepMerge({}, defaults, option);
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
    injectStyles() {
        // Inject stylesheet
        let styles = {};
        if (this.options?.styles && Object.keys(this.options.styles).length > 0) {
            styles = Utils.deepMerge({}, this.options.styles, styles);
        }
        styles && Utils.injectStylesheet(styles, this.id.toString());
    }
    setupCallbacks() {
        // Handle onChange event
        this.onChange = (target) => { if (this.options?.onChange)
            this.options.onChange(target); };
        // Handle onLoad event
        this.onLoadCallback = this.options?.onLoad;
    }
    processRadiobox(ele, index) {
        if (ele.type !== 'radio')
            return;
        if (ele.hasAttribute('data-radiobox'))
            return;
        ele.setAttribute('data-radiobox', 'true');
        if (Utils.isEmpty(this.groupName))
            this.groupName = ele.name;
        if (ele.name !== this.groupName)
            Utils.throwError('All radioboxes must belong to the same group');
        // Handle radiobox title
        let labelSibling = ele.nextElementSibling;
        let bindLabel = this.options.bindLabel ?? false;
        let { title, remainLabel, randomID, labelToRestore } = Utils.handleRadioboxTitle(ele, labelSibling);
        bindLabel = remainLabel ? true : bindLabel;
        // Handle radiobox checked status
        if (this.options.checked) {
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
    updateRadioboxCheckedStatus(ele, index) {
        // Logic to determine if a radiobox should be checked based on the provided options
        const checked = this.options.checked;
        if ((typeof checked === 'string' && ele.value === checked) || (typeof checked === 'number' && index === checked)) {
            // Remove checked attribute from other radio boxes
            this.allElement.forEach(el => el !== ele && Utils.toggleCheckStatus(el, false));
            Utils.toggleCheckStatus(ele, true);
        }
    }
    updateAllRadioboxesCheckedStatus(selectedEle, selectedIndex) {
        // When a radiobox is checked manually, ensure only one radiobox is checked at a time
        this.allElement.forEach((ele, index) => {
            const shouldBeChecked = (ele === selectedEle) || (selectedIndex === index);
            Utils.toggleCheckStatus(ele, shouldBeChecked);
        });
    }
    radioBoxChange(target = null) {
        this.onChangeCallback?.(target);
        if (target) {
            this.updateAllRadioboxesCheckedStatus(target, this.allElement.indexOf(target));
        }
    }
    destroy() {
        // Reset firstLoad flag
        RadioBox.firstLoad = false;
        // Remove event listeners from all elements
        this.allElement.forEach(element => {
            Utils.restoreElement(element);
        });
        // Reset instance variables
        this.element = null;
        this.options = {};
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
    set onChange(callback) {
        this.onChangeCallback = callback;
    }
    /**
     * Get all radio box elements
     * @return {RadioInputElement[]} All radio box elements
     */
    get elements() {
        return this.allElement;
    }
    /**
     * Get value of the checked radio box
     * @return {string} Value of the checked radio box
     */
    get value() {
        let checkedRadio = this.allElement.find(element => element.checked);
        return checkedRadio ? checkedRadio.value : null;
    }
    empty() {
        this.allElement.forEach(element => {
            element.checked = false;
            element.removeAttribute('checked');
        });
        this.allElement = [];
        return this;
    }
    refresh() {
        // Re-initialize the current instance
        if (this.element) {
            this.init(this.element, this.options, this.id);
        }
    }
    static destroyAll() {
        // Call destroy on all instances
        while (RadioBox.instances.length) {
            const instance = RadioBox.instances[0];
            instance.destroy();
        }
    }
}

export { RadioBox as default };
