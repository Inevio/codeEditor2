'use strict'

// Renderizado
import { render } from '../render.js'
// Utilidades
import { baseULHorbitoSidebarSUB, itemLIHorbitoSidebarSUB } from '../utils.js'

// Listar carpetas con FS de Horbito
/* folder: ID de la carpeta a listar
 * cb: Callback que retorna un array de los objetos (archivos) que contiene el directorio
 */
function fsList (idFolder, cb) {
  // Si es un archivo cancelar la operacion "Listar"
  if (idFolder.type === 3) return

  // API FileSystem de Horbito
  api.fs(idFolder, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error

    // console.log(fsNode) // Carpeta Root

    // Listar carpeta y archivos: $ ls
    fsNode.list(function (err, listFiles) {
      if (err) return cb(err) // En caso de error

      // Array con los archivos y carpeta del directorio listado
      // En caso de existir directorios dentro, se pueden listar tambien
      // type: 3 ---> Es un Archivo
      // console.log(listFiles)

      // Array de objetos (que representan archivos en Horbito)
      cb(null, listFiles)
    })
  })
}

// Leer archivos con FS de Horbito
/* folder: ID del archivo a leer
 */
function fsRead (idFile) {
  api.fs(idFile, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error

    fsNode.read(function (err, fileContent) {
      if (err) return console.log(err) // En caso de error

      // Crear nuevo archivo: Crear tab y textarea
      render.newFile(fsNode.id, fsNode.name, fsNode.mime, fileContent)
    })
  })
}

// Listar carpetas (desplegar) del Sidebar
function listFolderAndClickItem (id) {
  // API FileSystem de Horbito
  api.fs(id, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error
    if (fsNode.type === 3) { // Leer archivos
      fsRead(id)
    } else { // Listar directorios
      // Listar carpeta y archivos: $ ls
      fsNode.list(function (err, listFiles) {
        if (err) return console.log(err) // En caso de error

        // Crear una lista desordenada (UL) para el contenido de la carpeta a listar (desplegar)
        baseULHorbitoSidebarSUB(id, 'subItem')

        for (let file of listFiles) {
          // Determinar si es una carpeta o un archivo y agregarle el icono correspondiente
          if (file.type !== 3) {
            itemLIHorbitoSidebarSUB(id, 'item', file.id, 'icon-folder', file.name)
          } else {
            itemLIHorbitoSidebarSUB(id, 'item', file.id, 'icon-file', file.name)
          }
        }
      })
    }
  })
}

// fsList: Lista una carpeta de Horbito
// fsRead: Lee un archivo de Horbito
// listFolderAndClickItem: Al hacer click en una carpeta del sibar, la lista (desplega) y en un archivo lo abre :)
export { fsList, fsRead, listFolderAndClickItem }
