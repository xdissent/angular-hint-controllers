# Angular Hint Controllers [![Build Status](https://travis-ci.org/angular/angular-hint-controllers.svg?branch=master)](https://travis-ci.org/angular/angular-hint-controllers) [![Code Climate](https://codeclimate.com/github/angular/angular-hint-controllers/badges/gpa.svg)](https://codeclimate.com/github/angular/angular-hint-controllers)

This hinting module is part of the overall tool [angular-hint](https://github.com/angular/angular-hint)
that provides advice about AngularJS best practices. Loading this module will provide warnings specific
to AngularJS controllers.

## Usage

Install the [angular-hint NPM module](https://www.npmjs.org/package/angular-hint)
and use `ng-hint` or `ng-hint-include="controllers"` to
enable angular-hint-controllers.

Further installation information is available on the
[main angular-hint repository](https://github.com/angular/angular-hint#usage).


## Features

1. Warns About Use of Global Controllers
  **Global Controllers are Deprecated in Angular 1.3.0**

  Angular controllers should not be globally registered. They should be
  registered on modules. For instance:

  ```javascript
  angular.module('myApp', []).controller(function() {});
  ```

2. Hints About Best Practices for Controller Naming

  Angular controller names should begin with a capital letter and end with -Controller.

  ```javascript
  angular.module('sampleApp', []).controller('SampleController', function() {});
  ```

## Contributing

We'd love to get your help! See the
[Contributing Guidelines](https://github.com/angular/angular-hint/blob/master/CONTRIBUTING.md)
to see how.

## License

Apache 2.0
