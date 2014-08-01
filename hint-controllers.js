'use strict';

var nameToControllerMatch = {},
  controllers = {},
  hintLog = angular.hint = require('angular-hint-log'),
  MODULE_NAME = 'Controllers',
  SEVERITY_ERROR = 1,
  SEVERITY_WARNING = 2;

/**
* Decorates $controller with a patching function to
* log a message if the controller is instantiated on the window
*/
angular.module('ngHintControllers', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate) {
        return function(ctrl, locals) {
          //If the controller name is passed, find the controller than matches it
          if(typeof ctrl === 'string') {
            ctrl = nameToControllerMatch[ctrl];
          }
          locals = locals || {};
          //If the controller is not in the list of already registered controllers
          //and it is not connected to the local scope, it must be instantiated on the window
          if(!controllers[ctrl] && (!locals.$scope || !locals.$scope[ctrl])) {
            if(angular.version.minor <= 2) {
              hintLog.logMessage(MODULE_NAME, 'It is against Angular best practices to ' +
                'instantiate a controller on the window. This behavior is deprecated in Angular' +
                ' 1.3.0', SEVERITY_WARNING);
            } else {
              hintLog.logMessage(MODULE_NAME, 'Global instantiation of controllers was deprecated' +
                ' in Angular 1.3.0. Define the controller on a module.', SEVERITY_ERROR);
            }
          }
          var ctrlInstance = $delegate.apply(this, [ctrl, locals]);
          return ctrlInstance;
        };
    });
});

/**
* Save details of the controllers as they are instantiated
* for use in decoration.
* Hint about the best practices for naming controllers.
*/
var originalModule = angular.module;
angular.module = function() {
  var module = originalModule.apply(this, arguments),
    originalController = module.controller;
  module.controller = function(controllerName, controllerConstructor) {
    nameToControllerMatch[controllerName] = controllerConstructor;
    controllers[controllerConstructor] = controllerConstructor;

    var firstLetter = controllerName.charAt(0);
    if(firstLetter !== firstLetter.toUpperCase() && firstLetter === firstLetter.toLowerCase()) {
      hintLog.logMessage(MODULE_NAME, 'The best practice is to name controllers with an' +
        ' uppercase first letter. Check the name of \'' + controllerName + '\'.', SEVERITY_WARNING);
    }

    var splitName = controllerName.split('Controller');
    if(splitName.length === 1 || splitName[splitName.length - 1] !== '') {
      hintLog.logMessage(MODULE_NAME, 'The best practice is to name controllers ending with ' +
        '\'Controller\'. Check the name of \'' + controllerName + '\'', SEVERITY_WARNING);
    }
    return originalController.apply(this, arguments);
  };
  return module;
};
