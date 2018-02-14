'use strict'

// Renderizado
import { render } from '../render.js'
// Utilidades
import { baseULHorbitoSidebarSUB, itemLIHorbitoSidebarSUB, filesOpened } from '../utils.js'

// Leer archivos con FS de Horbito
/* folder: ID del archivo a leer
 */
function fsRead (idFile, horbiting) {
  api.fs(idFile, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error

    fsNode.read(function (err, fileContent) {
      if (err) return console.log(err) // En caso de error

      // Crear nuevo archivo: Crear tab y textarea
      render.newFile(fsNode.id, horbiting, fsNode.name, fsNode.mime, fileContent)
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
$('.sidebar').on('click', 'div[idhorbito]', function () {
  // ID de la carpeta
  const id = $(this).attr('idhorbito')

  // Contador de clicks
  let click = 0
  
  click++
  if (click === 1) {
    setTimeout(() => {
      if ($(`div[idhorbito='${id}']`).siblings()[0]) { // Determinar si la carpeta ya esta listada
        // Plegar carpeta, eliminar la lista que contiene los archivos y carpetas desplegados
        $(`div[idhorbito='${id}']`).siblings()[0].remove()
        $(`div[idhorbito]`).removeClass('selected') // Remover la seleccion de todos los items
      } else { // En caso de no estarlo, listartla (desplegarla)
        listFolderAndClickItem(id)
        $(`div[idhorbito]`).removeClass('selected') // Remover la seleccion de todos los items
        $(`div[idhorbito='${id}']`).addClass('selected')
      }
      click = 0
    }, 500)
  }
})

// Guardar archivo
function saveFile (fileID, content) {
  console.log("saveFile: ", fileID, content)
  // Obtener metodos del archivo a guardar
  api.fs(fileID, (err, file) => {
    if (err) return console.log(err) // En caso de error
    // Sobreescribir archivo
    file.write(content, (err) => {
      if (err) return console.log(err) // En caso de error
    })
  })

  console.log('Guardar')
}

// Guardar archivo como...
function saveFileAs (index, options) {

  // Abrir ventana para seleccionar
  api.fs.selectDestiny(options, (err, response) => {
    if (err) return console.log(err) // En caso de error
    console.log('Destino: ', response)
  })

  console.log('Guardar como...', index, options)
}

// Click derecho sobre los items del sidebar
// Agregar, renombrar, eliminar elementos del Sidebar
$('.sidebar').on('contextmenu', 'div[idhorbito]', function () {
  // Inicializacion de una instancia del ContextMenu de Horbito
  const menu = api.menu()

  // Propiedades del item clickeado (con el click derecho)
  const item = {
    "id": $(this).attr('idhorbito'), 
    "type": $(this).children().attr('class')
  }

  // Determinar si se trata de un archivo o un directorio
  if (item.type === 'icon-folder') { // En caso de ser una carpeta
    menu.addOption('New File', () => { newFileFolder(item.id) } )
    menu.addOption('New Folder', () => { newFolderFolder(item.id) } )
    menu.addOption('Rename', () => { renameItem(item.id) })
    menu.addOption('Delete', () => { deleteItem(item.id) })
  } else { // En caso de ser un archivo
    menu.addOption('Rename', () => { renameItem(item.id) })
    menu.addOption('Delete', () => { deleteItem(item.id) })
  }

  // Rendelizado del ContextMenu
  menu.render()
})

// [Folder] New File
function newFileFolder (id) {
  console.log(`Intestas crear un nuevo archivo en la carpeta ${id}`)
}

// [Folder] New Folder
function newFolderFolder (id) {
  console.log(`Intestas crear una carpeta en en la carpeta ${id}`)
}

// [Folder|File] Rename
function renameItem (id) {
  console.log(`Intestas renombrar a ${id}`)
}

// [Folder|File] Delete
function deleteItem (id) {
  console.log(`Intestas eliminar a ${id}`)
}

// fsRead: Lee un archivo de Horbito
// listFolderAndClickItem: Al hacer click en una carpeta del sibar, la lista (desplega) y en un archivo lo abre :)
// saveFile: Al hacer click sobreescribe el archivo y salva los cambios
// saveFileAs: Al hacer click te pide la ubicacion de donde salvar los cambios del archivo
export { fsRead, listFolderAndClickItem, saveFile, saveFileAs }
