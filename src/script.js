import './style.css'
// import './cm/lib/codemirror.js'
// import './cm/mode/javascript/javascript.js'

// const window = $(':first').parents().slice(-1)[0].parentNode.defaultView;
// const document = window.document;

// console.log(`Hello World: ${document}`)

// const editor = CodeMirror.fromTextArea(document.getElementById('myTextArea'), {
//   // lineNumbers: true,
//   // mode: "javascript",
//   // theme: "monokai",
//   // keyMap: "sublime"
// });

// Barra de navegacion: File, desplegar sub menu.
$('#file').click(function () {
  $('#fileItems').toggleClass('hide')
})
