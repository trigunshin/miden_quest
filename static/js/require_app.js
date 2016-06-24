console.info('required it in!');

/*
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/static/js/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    //paths: {
    //    app: '../app'
    //}

    shim: {
	    'react': {exports: 'React'},
	    'react-dom': {
	    	deps: ['react'],
	    	exports: 'ReactDOM'
	    },
	    'redux': {exports: 'Redux'},
	    'react-redux': {
	    	deps: ['react', 'react-dom', 'redux'],
	    	exports: 'ReactRedux'
	    },
	    'babel': {exports: 'Babel'}
    }
});

// Start the main app logic.
requirejs(['jquery', 'react', 'react-dom', 'redux', 'react-redux', 'babel', 'lodash'],
		($, react, reactDom, redux, reactRedux, Babel, _) => {
    console.info('requirejs jquery', $, _, 'react', react);
/*
var file1 = $.getJSON("file1.json"), // $.getJSON returns a Deferred
    file2 = $.getJSON("file2.json"), 
    all   = $.when(file1, file2);    // and $.when groups several Deferreds

// example usage - you can do the same for the individual files
all.done(function () {
  // something to call when all files have been successfully loaded
});

all.fail(function () {
  // something to call in case one or more files fail
});

all.always(function () {
  // something to always call (like, say, hiding a "loading" indicator)
});





    $.get('static/js/app.jsx', (data) => {
      var output = Babel.transform(data, {presets: ['es2015', 'react']}).code;
      // Create a new script tag of `javascript` type
      var new_script = document.createElement('script');
      new_script.setAttribute('type', 'text/javascript');
      // Set the contents of the script to the transpiled code
      new_script.textContent = output;
      // Inject the new transpiled JS
      document.querySelector('body').appendChild(new_script);
    });
    //*/
//});

