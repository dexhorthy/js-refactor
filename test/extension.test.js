'use strict';

var assert = require('chai').assert;
var mockery = require('mockery');
var vscodeFake = require('./test-utils/vscode-fake');
var vscodeFactory = require('../modules/shared/vsCodeFactory')();
var testUtils = require('./test-utils/test-utils');
var packageObj = require('../package.json');

require('./test-utils/approvals')();

function addOnCommandToSet (commandSet, commandStr){
    var key = commandStr.replace('onCommand:', '');
    commandSet[key] = true;
    return commandSet;
}

describe('register actions', function() {

    var extension;
    var commandRegister;
    var commandKeys;
    var onCommandSet;

    beforeEach(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        mockery.registerMock('vscode', vscodeFake);
        extension = require('../extension');

        extension.activate({ subscriptions: [] });

        commandKeys = Object.keys(vscodeFake.commands.getRegisteredCommandList());
        onCommandSet = packageObj.activationEvents.reduce(addOnCommandToSet, {});
    });

    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should match every command with an onCommand value in the package.json file', function () {
        commandKeys.forEach(function (key) {
            assert.equal(onCommandSet[key], true);
        });
    });

    it('should have a one-to-one, onto relationship between actions and activationEvents values', function () {
        assert.equal(packageObj.activationEvents.length, commandKeys.length);
    });
    
    it('should match every command with a command registration in the package.json file', function () {
        packageObj.contributes.commands.forEach(function (record) {
            assert.equal(typeof vscodeFake.commands.getRegisteredCommand(record.command), 'function');
        });
    });

    it('should have a one-to-one, onto relationship between actions and commands values', function () {
        assert.equal(packageObj.contributes.commands.length, commandKeys.length);
    });
    
});