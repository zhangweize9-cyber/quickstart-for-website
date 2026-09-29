// WIP: Virtual File System(frontend, not backend).
// const virtualFileSystem = {
//   "/": {
//     type: "dir",
//     children: {
//       "help.txt": { type: "file", content: "This is virtual file system." },
//       "projects": {
//         type: "dir",
//         children: {
//           "app.js": { type: "file", content: "console.log('Hello World');" }
//         }
//       }
//     }
//   }
// };
//
// let currentPath = "/";
// let currentPathStack = [];

import $ from 'jquery';

window.jQuery = window.$ = $;

import 'jquery.terminal';
// import 'jquery.terminal/js/jquery.terminal.min.js';
import 'jquery.terminal/css/jquery.terminal.min.css';
// import 'jquery/dist/jquery.min.js';

// Based on jquery terminal.
$('body').terminal({
  open: function() {
    this.echo('you try to open').exec('close');
  },
  close: function() {
    this.echo('you closed');
  },
  hello: function() {
    this.echo('hello world');
  }
}, {
  // NOTE: tags with ID are defined as global variable
  greetings: greetings.innerHTML
});
