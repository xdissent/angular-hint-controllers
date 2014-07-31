hint-controllers [![Build Status](https://travis-ci.org/angular/angular-hint-controllers.svg?branch=master)](https://travis-ci.org/angular/angular-hint-controllers) [![Code Climate](https://codeclimate.com/github/angular/angular-hint-controllers/badges/gpa.svg)](https://codeclimate.com/github/angular/angular-hint-controllers)
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
  ```

2. Hints About Best Practices for Controller Naming

  Angular controller names should begin with a capital letter and end with -Controller.

  ```javascript
  angular.module('SampleApp', []).controller('SampleController', function() {});
  ```
