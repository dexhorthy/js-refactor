'use strict';



function shiftParamsLeftFactory(
    logger, 
    selectionFactory, 
    editActionsFactory,
    utilities,
    variableOrderAction) {

    return function (vsEditor, callback) {

        var editActions = editActionsFactory(vsEditor);

        function applyRefactor(selection) {
            var coords = utilities.buildCoords(vsEditor, 0);
            var text = variableOrderAction.shiftParamsLeft(selection[0]);

            return editActions.applySetEdit(text, coords);
        }

        function shiftParamsLeft() {
            var selection = selectionFactory(vsEditor).getSelection(0);

            if (selection === null) {
                logger.info('Cannot shift parameters on an empty selection.');
            } else {
                applyRefactor(selection).then(callback);
            }
        }

        return shiftParamsLeft;
    };

}

module.exports = shiftParamsLeftFactory;