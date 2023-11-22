import { setStylesheetId, setReplaceRule, domUtils } from '@carry0987/utils';

setStylesheetId('radiobox-style');
setReplaceRule('.radio-box', '.radio-box-');

export function getTemplate(id) {
    let template = `
    <div class="radio-box radio-box-${id}">
        <label class="radio-title"></label>
    </div>
    `;
    return template;
}

export default domUtils;
