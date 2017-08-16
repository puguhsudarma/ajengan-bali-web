// Browser Color
app
  .config(['$mdThemingProvider', function ($mdThemingProvider) {
    // Enable browser color
    $mdThemingProvider.enableBrowserColor({
      theme: 'default', // Default is 'default'
      palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
      hue: '800' // Default is '800'
    });
  }]);