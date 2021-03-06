'use strict';

function wrapInFunctionFactory(
    logger, 
    selectionFactory,
    utilities,
    templateUtils,
    editActionsFactory) {

    var functionTemplate = templateUtils.getTemplate('function');

    return function (vsEditor, callback) {
        var editActions = editActionsFactory(vsEditor);

        function cleanFunctionName(functionName) {
            return functionName.trim() === '' ? '' : functionName + ' ';
        }

        function updateCode(selection, functionName) {
            var contextExtension = { name: cleanFunctionName(functionName) };
            var context = templateUtils.buildExtendedContext(vsEditor, selection, contextExtension);

            var coords = utilities.buildCoords(vsEditor, 0);
            var text = templateUtils.fillTemplate(functionTemplate, context);

            return editActions.applySetEdit(text, coords);
        }

        return function wrapInFunction() {
            var selection = selectionFactory(vsEditor).getSelection(0);

            if (selection === null) {
                logger.info('Cannot wrap empty selection. To create a new function, use the function (fn) snippet.');
            } else {
                logger.input({ prompt: 'Name of your function' }, function (functionName) {
                    updateCode(selection, functionName).then(callback);
                });
            }
        }

    }

}

module.exports = wrapInFunctionFactory;