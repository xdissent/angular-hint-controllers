'use strict';

var hint = angular.hint = require('angular-hint-log');

var MODULE_NAME = 'Controllers',
    CATEGORY_CONTROLLER_NAME = 'Name controllers according to best practices',
    SEVERITY_ERROR = 1,
    SEVERITY_WARNING = 2;

// local state
var nameToControllerMap = {},
    controllers = {};

/**
* Decorates $controller with a patching function to
* log a message if the controller is instantiated on the window
*/
angular.module('ngHintControllers', []).
  config(function ($provide) {
    $provide.decorator('$controller', controllerDecorator);
  });

function controllerDecorator($delegate) {
  return function(ctrl, locals) {
    var ctrlAs;
    //If the controller name is passed, find the controller than matches it
    if (typeof ctrl === 'string') {
      // Extract controller name from possible expression
      var match = ctrl.match(/^(\S+)(\s+as\s+(\w+))?$/);
      ctrl = match[1];
      ctrlAs = match[3];
      if (nameToControllerMap[ctrl]) {
        ctrl = nameToControllerMap[ctrl];
      } else {
        //If the controller function cannot be found, check for it on the window
        sendMessageForControllerName(ctrl);
        ctrl = window[ctrl] || ctrl;
        if (typeof ctrl === 'string') {
          throw new Error('The controller function for ' + ctrl + ' could not be found.' +
            ' Is the function registered under that name?');
        }
      }
    }
    locals = locals || {};
    //If the controller is not in the list of already registered controllers
    //and it is not connected to the local scope, it must be instantiated on the window
    if (!controllers[ctrl] && (!locals.$scope || !locals.$scope[ctrl]) &&
        ctrl.toString().indexOf('@name ngModel.NgModelController#$render') === -1 &&
        ctrl.toString().indexOf('@name form.FormController') === -1) {
      if (angular.version.minor <= 2) {
        hint.logMessage(MODULE_NAME, 'It is against Angular best practices to ' +
          'instantiate a controller on the window. This behavior is deprecated in Angular' +
          ' 1.3.0', SEVERITY_WARNING);
      } else {
        hint.logMessage(MODULE_NAME, 'Global instantiation of controllers was deprecated' +
          ' in Angular 1.3.0. Define the controller on a module.', SEVERITY_ERROR);
      }
    }
    var args = [ctrl, locals].concat(Array.prototype.slice.call(arguments, 2));
    args[3] = args[3] || ctrlAs;
    var ctrlInstance = $delegate.apply(this, args);
    return ctrlInstance;
  };
}

/**
* Save details of the controllers as they are instantiated
* for use in decoration.
* Hint about the best practices for naming controllers.
*/
var originalModule = angular.module;

function sendMessageForControllerName(name) {
  var newName = name;
  if (!startsWithUpperCase(name)) {
    newName = title(newName);
  }
  if (!endsWithController(name)) {
    newName = addControllerSuffix(newName);
  }
  if (name !== newName) {
    hint.logMessage(MODULE_NAME,
      'Consider renaming `' + name + '` to `' + newName + '`.',
      SEVERITY_WARNING,
      CATEGORY_CONTROLLER_NAME);
  }
}

function startsWithUpperCase(name) {
  var firstChar = name.charAt(0);
  return firstChar === firstChar.toUpperCase() &&
         firstChar !== firstChar.toLowerCase();
}

function title (name) {
  return name[0].toUpperCase() + name.substr(1);
}

var CONTROLLER_RE = /Controller$/;
function endsWithController(name) {
  return CONTROLLER_RE.test(name);
}

var RE = /(Ctrl|Kontroller)?$/;
function addControllerSuffix(name) {
  return name.replace(RE, 'Controller');
}

/*
 * decorate angular module API
 */

angular.module = function() {
  var module = originalModule.apply(this, arguments),
      originalController = module.controller;

  module.controller = function(controllerName, controllerConstructor) {
    nameToControllerMap[controllerName] = controllerConstructor;
    controllers[controllerConstructor] = controllerConstructor;
    sendMessageForControllerName(controllerName);
    return originalController.apply(this, arguments);
  };
  return module;
};
