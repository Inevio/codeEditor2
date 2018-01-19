// CodeMirror
// var myCodeMirror = CodeMirror.fromTextArea($('#myTextArea')[0], {
//   lineNumbers: true,
//   mode: "javascript",
//   theme: "monokai",
//   keyMap: "sublime"
// });

// Sidebar
var folder = ['']

// Guardamos el objeto que representa la venta en editor_win
var editor_win = $(this);

// Fijate que cuando abres la app este archivo empieza a ejecutarse
// y por eso en la consola del navegador sale este console
console.log('Hello World')

// Pido el FSNode que representa el directorio raiz para poder pedirle todos sus archivos y carpetas
api.fs( 'root', ( err, fsnode ) => {
  // Compruebo si hay error para no seguir
  if( err ) return console.log( 'Error al pedir el FSNode de la carpeta raiz:\n', err ) // \n es un salto de linea (como un intro)

  // DEBUG
  console.log( 'El resultado de pedir el FSNode de la carpeta raiz son:\n', fsnode )
  // Lo pongo con comas porque una cosa es un string y otra un objeto
  //y si uso el + el objeto me lo pinta normalmente ocmo [Object object] y no me muestra informacion sobre el


  // Pedimos al FSNode que representa el directorio raiz de Files todos sus archivos y carpetas
  fsnode.list( ( err, fsnodeList ) => {
    // Comprobamos si hay error
    if( err ) return console.log( 'Error al pedir los archivos y carpetas al directorio raiz de Files:\n', err )


    // Todo funciono correctamente y ahora en fsnodeList tengo un array de fsNodes a los que le puedo volver a hacer list para listar (SI SON CARPETAS) etc etc
    console.log('El resultado de pedir los archivos y carpetas del directorio raiz son:\n', fsnodeList )
  })

})

// Metodos utiles
let isFile = (type) => { type === 3 }
let isDirectory = (type) => { type !== 3 }


let obtenerTodosLosArchivos = ( (idRutaOrigen, callback ) => {
  api.fs( idRutaOrigen, ( err, fsnode ) => {
    if( err ) return callback( err )
    // ¿Por que ahora es callback y no console.log? Porque estamos en una funcion que el resultado se devuelve por callback

    // Si es una carpeta hacemos recursion
    if( isDirectory( fsnode.type ) ){
      fsnode.list( ( err, fsnodeList ) => {
        if( err ) return callback( err )
        fsnodeList.forEach( (elem) => {
          recorrerTodosLosArchivos( elem.id, ( err, res ) => {
            if( err ) return callback( err )
            callback( null, err )
          }) // Esta version no funciona pero ilusta la idea de la recursion
        })
      })
    }else{
      // Es un archivo
      callback( null, fsnode )
    }

  })
})
/*
console.log('Vamos a obtener todos los archivos')
obtenerTodosLosArchivos( 'root', ( err, res ) => {
  if( err ) return console.log( 'Error:\n', err ) // Aqui es donde ponemos el console
  console.log( 'Res:\n', res )
})
*/
