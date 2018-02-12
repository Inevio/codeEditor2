'use strict'

// Renderizado
import { render } from '../render.js'
// Utilidades
import { baseULHorbitoSidebarSUB, itemLIHorbitoSidebarSUB } from '../utils.js'

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

// Evento click sobre un archivo o carpeta en el Sidebar
let click = 0
$('.sidebar').on('click', 'div[idhorbito]', function () {
  // ID de la carpeta
  const id = $(this).attr('idhorbito')
  
  click++
  if (click === 1) {
    setTimeout(() => {
      if ($(`div[idhorbito='${id}']`).siblings()[0]) { // Determinar si la carpeta ya esta listada
        // Plegar carpeta, eliminar la lista que contiene los archivos y carpetas desplegados
        $(`div[idhorbito='${id}']`).siblings()[0].remove()
      } else { // En caso de no estarlo, listartla (desplegarla)
        listFolderAndClickItem(id)
      }
      click = 0
    }, 500)
  }
})

// fsRead: Lee un archivo de Horbito
// listFolderAndClickItem: Al hacer click en una carpeta del sibar, la lista (desplega) y en un archivo lo abre :)
export { fsRead, listFolderAndClickItem }
