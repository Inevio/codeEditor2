'use strict'

// Renderizado
import { render } from '../render.js'
// Opciones para la creacion de una nueva zona de edicion
import { newFileOpts } from '../config.js'

// Listar carpetas con FS de Horbito
/* folder: ID de la carpeta a listar
 * cb: Callback que retorna un array de los objetos (archivos) que contiene el directorio
 */
function fsList (idFolder, cb) {
  // API FileSystem de Horbito
  api.fs(idFolder, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error

    // console.log(fsNode) // Carpeta Root

    // Listar carpeta y archivos: $ ls
    fsNode.list(function (err, listFiles) {
      if (err) return console.log(err) // En caso de error

      // Array con los archivos y carpeta del directorio listado
      // En caso de existir directorios dentro, se pueden listar tambien
      // type: 3 ---> Es un Archivo
      // console.log(listFiles)

      // Array de objetos (que representan archivos en Horbito)
      cb(listFiles)
    })
  })
}

// Leer archivos con FS de Horbito
/* folder: ID del archivo a leer
 */
function fsRead (idFile, tabs) {
  api.fs(idFile, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error

    fsNode.read(function (err, fileContent) {
      if (err) return console.log(err) // En caso de error

      // Crear nuevo archivo: Crear tab y textarea
      render.newFile(tabs, fsNode.name, newFileOpts('htmlmixed', fileContent))
    })
  })
}

// fsList: Lista una carpeta de Horbito
// fsRead: Lee un archivo de Horbito
export { fsList, fsRead }
