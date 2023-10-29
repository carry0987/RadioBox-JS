import Utils from '@carry0987/utils';

Utils.setStylesheetId = 'radiobox-style';
Utils.setReplaceRule('.radio-box', '.radio-box-');

Utils.getTemplate = function(id) {
    let template = `
    <div class="radio-box radio-box-${id}">
        <label class="radio-title"></label>
    </div>
    `;
    return template;
}

Utils.getChecked = function() {
    return this.ele.checked;
}

export default Utils;
