(function() {

'use strict';

/**
* Decorates $controller with a patching function to
* throw an error if DOM APIs are manipulated from
* within an Angular controller
*/
angular.module('ngHintController', []).
  config(function ($provide) {
    $provide.decorator('$controller', function($delegate, $injector) {
      return function(ctrl, locals) {
        if(angular.isString(ctrl)) {
          match = expression.match(CNTRL_REG),
          constructor = match[1],
          identifier = match[3];
          ctrl = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : console.log('Not on window') || console.log('It is against Angular best practices to instantiate a controller on the window.');
        }
        var ctrlInstance = $delegate.apply(this, [ctrl, locals]);
        return ctrlInstance;
      }
    });
  });

}());