var hintLog = angular.hint;

var SEVERITY_ERROR = 1,
    SEVERITY_WARNING = 2;

describe('controllerDecorator', function() {
  var $controller, $rootScope;

  beforeEach(module('ngHintControllers'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$compile_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    spyOn(hintLog, 'logMessage').andCallThrough();
  }));

  afterEach(function () {
    hintLog.flush();
  })

  function MockController() {
    var element = document.createElement('a');
    element.innerHTML = 'testValue';
  }

  it('should detect if a controller is instantiated on the window', function() {
    var sampleControl = $controller(MockController);
    if (angular.version.minor < 3) {
      expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers', 'It is against Angular best ' +
        'practices to instantiate a controller on the window. This behavior is deprecated in ' +
        'Angular 1.3.0', SEVERITY_WARNING);
    } else {
      expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers', 'Global instantiation of ' +
        'controllers was deprecated in Angular 1.3.0. Define the controller on a module.', SEVERITY_ERROR);
    }
  });


  it('should not warn about angular internal controllers instantiated on the window', function() {
    var scope = $rootScope.$new();
    angular.module('SampleApp', []).controller('SampleController', function($scope) {
      $scope.types = [
        { name: 'Controllers', isChecked: false},
        { name: 'Directives', isChecked: false},
        { name: 'DOM', isChecked: false},
        { name: 'Events', isChecked: false},
        { name: 'Interpolation', isChecked: false},
        { name: 'Modules', isChecked: false}
      ];
    });
    var ctrl = $controller('SampleController', {$scope: scope});
    var elm = angular.element('<div ng-controller="SampleController">' +
                                '<span ng-repeat="type in types">' +
                                  '<input  type="checkbox" id="{{type.name}}" ng-click="changeList()" ng-model="type.isChecked">' +
                                    '{{type.name}}' +
                                '</span>' +
                                '<form></form>' +
                              '</div>');
    $compile(elm)(scope);
    $rootScope.$digest();
    expect(hintLog.logMessage).not.toHaveBeenCalled();
  });


  it('should allow the instantiation of global controller functions', function() {
    var scope = $rootScope.$new();

    window.GlobalFunction = function GlobalFunction($scope) {
      $scope.types = [
        { name: 'Controllers', isChecked: false},
        { name: 'Directives', isChecked: false},
        { name: 'DOM', isChecked: false},
        { name: 'Events', isChecked: false},
        { name: 'Interpolation', isChecked: false},
        { name: 'Modules', isChecked: false}
      ];
    };

    var ctrl = $controller('GlobalFunction', {$scope: scope});
    var elm = angular.element('<div ng-controller="GlobalFunction">' +
                                '<span ng-repeat="type in types">' +
                                  '<input  type="checkbox" id="{{type.name}}" ng-click="changeList()" ng-model="type.isChecked">' +
                                    '{{type.name}}' +
                                '</span>' +
                                '<form></form>' +
                              '</div>');
    expect(function() {
      $compile(elm)(scope);
      $rootScope.$digest();
    }).not.toThrow();

    delete window.GlobalFunction;
  });


  it('should still warn about the naming of global controller functions', function() {
    var scope = $rootScope.$new();
    window.globalFunction = function globalFunction($scope) {
      $scope.types = [
          { name: 'Controllers', isChecked: false},
          { name: 'Directives', isChecked: false},
          { name: 'DOM', isChecked: false},
          { name: 'Events', isChecked: false},
          { name: 'Interpolation', isChecked: false},
          { name: 'Modules', isChecked: false}
        ];
    }
    var ctrl = $controller('globalFunction', {$scope: scope});
    var elm = angular.element('<div ng-controller="globalFunction">' +
                                '<span ng-repeat="type in types">' +
                                  '<input  type="checkbox" id="{{type.name}}" ng-click="changeList()" ng-model="type.isChecked">' +
                                    '{{type.name}}' +
                                '</span>' +
                                '<form></form>' +
                              '</div>');
    $compile(elm)(scope);
    $rootScope.$digest();
    expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers',
        'Consider renaming `globalFunction` to `GlobalFunctionController`.',
        SEVERITY_WARNING,
        'Name controllers according to best practices');

    delete window.globalFunction;
  });


  it('should throw a helpful error if the controller cannot be created', function($scope) {
    var scope = $rootScope.$new();
    window.GlobalFunction = function GlobalFunction($scope) {
      $scope.types = [
        { name: 'Controllers', isChecked: false},
        { name: 'Directives', isChecked: false},
        { name: 'DOM', isChecked: false},
        { name: 'Events', isChecked: false},
        { name: 'Interpolation', isChecked: false},
        { name: 'Modules', isChecked: false}
      ];
    }
    expect(function() {
      var ctrl = $controller('NotTheGlobalFunction', {$scope: scope});
    }).toThrow('The controller function for NotTheGlobalFunction could not be found. ' +
        'Is the function registered under that name?');

    delete window.GlobalFunction;
  });


  it('should explain global controller deprecation for versions greater than 1.2.x', function() {
    if (angular.version.minor < 3) {
      return;
    }

    $controller(MockController);
    expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers', 'Global instantiation of ' +
      'controllers was deprecated in Angular 1.3.0. Define the controller on a module.', SEVERITY_ERROR);
  });


  it('should not log a message if the controller is on the local scope', function() {
    angular.module('SampleApp', []).controller('SampleController', function() {});
    $controller('SampleController');
    expect(hintLog.logMessage).not.toHaveBeenCalledWith('Controllers', 'It is against Angular' +
      'best practices to instantiate a controller on the window. This behavior is deprecated in' +
      ' Angular 1.3.0', (angular.version.minor < 3 ? SEVERITY_WARNING : SEVERITY_ERROR));
  });


  it('should warn if a controller name does not begin with an uppercase letter', function(){
    angular.module('SampleApp', []).controller('sampleController', function() {});
    $controller('sampleController');
    expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers',
        'Consider renaming `sampleController` to `SampleController`.',
        SEVERITY_WARNING,
        'Name controllers according to best practices');
  });


  it('should not warn if a controller name begins with an uppercase letter', function(){
    angular.module('SampleApp', []).controller('SampleController', function() {});
    $controller('SampleController');
    expect(hintLog.logMessage).not.toHaveBeenCalled();
  });


  it('should warn if a controller name does not include Controller', function(){
    angular.module('SampleApp', []).controller('Sample', function() {});
    $controller('Sample');
    expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers',
        'Consider renaming `Sample` to `SampleController`.',
        SEVERITY_WARNING,
        'Name controllers according to best practices');
  });


  it('should warn if a controller name does not end with Controller', function(){
    angular.module('SampleApp', []).controller('SampleControllerYay', function() {});
    $controller('SampleControllerYay');
    expect(hintLog.logMessage).toHaveBeenCalledWith('Controllers',
        'Consider renaming `SampleControllerYay` to `SampleControllerYayController`.',
        SEVERITY_WARNING,
        'Name controllers according to best practices');
  });


  it('should not warn if a controller ends with Controller', function(){
    angular.module('SampleApp', []).controller('SampleController', function() {});
    $controller('SampleController');
    expect(hintLog.logMessage).not.toHaveBeenCalled();
  });


  it('should collect all hinting messages using hintLog', function() {
    var sampleControl = $controller(MockController);
    angular.module('SampleApp', []).controller('sample', function() {});
    $controller('sample');
    var log = hintLog.flush();
    var totalNumberOfMessages = log['Controllers'].warning.length +
                                (log['Controllers'].error || []).length;

    expect(totalNumberOfMessages).toBe(2);
  });
});
