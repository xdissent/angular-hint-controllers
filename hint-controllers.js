'use strict';

var nameToControllerMatch = {};
var controllers = {};
var hintLog = angular.hint = require('angular-hint-log');

/**
* Decorates $controller with a patching function to
* log a message if the controller is instantiated on the window
*/
angular.module('ngHintController', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate, $injector) {
        return function(ctrl, locals) {
          if(typeof ctrl == 'string') {
            ctrl = nameToControllerMatch[ctrl];
          }
          // patch methods on $scope
          if (!locals) {
           locals = {};
          }
          //If the controller is not in the list of already registered controllers
          //and it is not connected to the local scope, it must be instantiated on the window
          if(controllers[ctrl] == undefined && (!locals.$scope || !locals.$scope[ctrl])) {
            hintLog.logMessage('It is against Angular best practices to instantiate a' +
              ' controller on the window. This behavior is deprecated in Angular 1.3.0');
          }
          var ctrlInstance = $delegate.apply(this, [ctrl, locals]);
          return ctrlInstance;
        }
    });
});

/**
* Save details of the controllers as they are instantiated
* for use in decoration.
*/
var originalModule = angular.module;
angular.module = function() {
  var module = originalModule.apply(this, arguments);
  var originalController = module.controller;
  module.controller = function(controllerName, controllerConstructor) {
    nameToControllerMatch[controllerName] = controllerConstructor;
    var firstLetter = controllerName.charAt(0);

    if(firstLetter !== firstLetter.toUpperCase() && firstLetter === firstLetter.toLowerCase()) {
      hintLog.logMessage('Controller best practices is to name the controller with an' +
        ' uppercase first letter. Check the name of ' + controllerName);
    }

    var splitName = controllerName.split('Controller');
    if(splitName.length == 1 || splitName[splitName.length - 1] !== '') {
      hintLog.logMessage('Controller best practices is for a controller name to end with '+
        '\'Controller\'. Check the name of ' + controllerName);
    }

    controllers[controllerConstructor] = controllerConstructor;
    return originalController.apply(this, arguments);
  };
  return module;
}
