hint-controllers
===============

This hinting module is part of the overall tool [AngularHint](https://github.com/angular/angular-hint)
that provides warnings about best practices. Loading this module will provide warnings to the console
that have to do with the operation of the Angular controller.

Features:
--------

1. Warns About Use of Global Controllers
  **Global Controllers are Deprecated in Angular 1.3.0**

  Angular controllers should not be globally registered. They should be
  registered on modules. For instance:

  ```javascript
  angular.module('controllerApp').controller(function(){
    //Do some behavior
  });
