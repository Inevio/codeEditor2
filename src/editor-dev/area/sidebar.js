'use strict'

// Renderizado
import { render } from '../render.js'
// Utilidades
import { baseULHorbitoSidebarSUB, itemLIHorbitoSidebarSUB, itemLIHorbitoSidebarSUBAddFolder, filesOpened, changeArrow, closeSidebar } from '../utils.js'

// Leer archivos con FS de Horbito
/* folder: ID del archivo a leer
 */
function fsRead (idFile, horbiting) {
  api.fs(idFile, (err, fsNode) => {
    if (err) return console.log(err) // En caso de error

    // En tester se almacena el resulado de la operacion de busqueda de igualdad
    let tester = filesOpened.find(element => { return element.id === Number(idFile) })

    if (!tester) {
      // Agregar mensaje de carga
      $('.text').prepend(`<div class="loading">${lang.loading}...</div>`)
    }

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
        $(`ul[idhorbito='${id}']`).hide() // Ocultar el contenedor de items (a la espera que este lleno)

        for (let file of listFiles) {
          // Determinar si es una carpeta o un archivo y agregarle el icono correspondiente
          if (file.type !== 3) {
            itemLIHorbitoSidebarSUB(id, 'item', file.id, 'icon-folder', file.name, '<i class="icon-arrow-right"></i>')
          } else {
            itemLIHorbitoSidebarSUB(id, 'item', file.id, 'icon-file', file.name)
          }
        }

        $(`ul[idhorbito='${id}']`).slideDown(110) // Ocultar el contenedor de items (a la espera que este lleno)
      })
    }
  })
}

let requestRunningFolder = false
// Evento click sobre una carpeta en el Sidebar
$('.sidebar').on('click', 'div[type="folder"]', function () {
  // En caso de que se este ejecutando el renderizado de los items
  if (requestRunningFolder) return

  // ID de la carpeta
  const id = $(this).attr('idhorbito')

  // Iniciar renderizado...
  requestRunningFolder = true
  setTimeout(() => {
    if ($(`div[idhorbito='${id}']`).siblings()[0]) { // Determinar si la carpeta ya esta listada
      // Plegar carpeta, eliminar la lista que contiene los archivos y carpetas desplegados
      $($(`div[idhorbito='${id}']`).siblings()[0]).animate({ height: 0 }, 150) // Efecto de plegado para los subItems
      // Esperar unos segundos para eliminar el elemento, de forma que el efecto ocurra sin problemas
      setTimeout(() => {
        $($(`div[idhorbito='${id}']`).siblings()[0]).remove()
      }, 125)
      $(`div[idhorbito]`).removeClass('selected') // Remover la seleccion de todos los items
      changeArrow($(this).children()[0]) // Cambio de flechas en el Sidebar
    } else { // En caso de no estarlo, listartla (desplegarla)
      listFolderAndClickItem(id) // Desplegar carpeta
      $(`div[idhorbito]`).removeClass('selected') // Remover la seleccion de todos los items
      changeArrow($(this).children()[0]) // Cambio de flechas en el Sidebar
    }
    // Finalizando renderizado...
    requestRunningFolder = false
  }, 500)
})

let requestRunningFile = false
// Evento doble-click sobre un archivo en el Sidebar
$('.sidebar').on('dblclick', 'div[type="file"]', function () {
  // En caso de que se este ejecutando el renderizado de los items
  if (requestRunningFile) return

  // ID de la carpeta
  const id = $(this).attr('idhorbito')

  // Iniciar renderizado...
  requestRunningFile = true
  setTimeout(() => {
    if ($(`div[idhorbito='${id}']`).attr('class') !== 'selected') { // Determinar si el archivo esta seleccionado
      $(`div[idhorbito]`).removeClass('selected') // Remover la seleccion de todos los items
      $(`div[idhorbito='${id}']`).addClass('selected')
    }
    listFolderAndClickItem(id) // Abrir archivo
    // Finalizando renderizado...
    requestRunningFile = false
  }, 500)
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
    "id": Number($(this).attr('idhorbito')), 
    "type": $(this).attr('type')
  }

  // Determinar si se trata de un archivo o un directorio
  if (item.type === 'folder') { // En caso de ser una carpeta
    item.type = lang.contextMenuItemTypeFolder // Configurar idioma al tipo de item
    menu.addOption(lang.contextMenuNewFile, () => { newFileSidebar(item) } )
    menu.addOption(lang.contextMenuNewFolder, () => { newFolderSidebar(item) } )
    menu.addOption(lang.contextMenuRename, () => { renameItem(item) })
    menu.addOption(lang.contextMenuDelete, () => { deleteItem(item) })
    menu.addOption(lang.contextMenuCloseFolder, () => { closeFolder(item) })
  } else { // En caso de ser un archivo
    item.type = lang.contextMenuItemTypeFile // Configurar idioma al tipo de item
    menu.addOption(lang.contextMenuRename, () => { renameItem(item) })
    menu.addOption(lang.contextMenuDelete, () => { deleteItem(item) })
  }

  // Rendelizado del ContextMenu
  menu.render()
})

// [Folder] New File
function newFileSidebar (item) {
  api.fs(item.id, (err, item) => {
    console.log('newFileSidebar', item.id)
  })
}

// [Folder] New Folder
function newFolderSidebar (item) {
  prompt(lang.contextMenuNewFolderSidebar, res => {
    if (res) {
      api.fs(item.id, (err, fsNode) => {
        fsNode.createDirectory(res, (err, folder) => {
          if (err) return console.log(err) // En caso de error
          if (err) alert(`${lang.contextMenuNewFolderSidebarERROR}: ${err}`) // En caso de error

          if ($(`div[idhorbito='${item.id}']`)[1] !== undefined) { // En caso de que la carpeta este vacia...
            // Crear una lista desordenada (UL) para el contenido de la carpeta a listar (desplegar)
            baseULHorbitoSidebarSUB(item.id, 'subItem')
            $(`ul[idhorbito='${item.id}']`).hide() // Ocultar el contenedor de items (a la espera que este lleno)
            
            // Generar la nueva carpeta
            itemLIHorbitoSidebarSUB(item.id, 'item', folder.id, 'icon-folder', folder.name, '<i class="icon-arrow-right"></i>')
            
            // Agregar item al Sidebar
            // $(`div[idhorbito='${item.id}']`).animate({ left: '-500px'}, 100).animate({ left: '25px'}, 200)

            $(`ul[idhorbito='${item.id}']`).slideDown(110) // Ocultar el contenedor de items (a la espera que este lleno)
          } else {
            // Generar la nueva carpeta
            itemLIHorbitoSidebarSUBAddFolder(item.id, 'item', folder.id, 'icon-folder', folder.name, '<i class="icon-arrow-right"></i>')
            $(`div[idhorbito='${folder.id}']`).animate({ left: '25px'}, 250).animate({ left: 0 }, 50) // Efecto de insercion de una carpeta al Sidebar
          }
        })
      })
    }
  })
}


// [Folder|File] Rename
function renameItem (item) {
  prompt(lang.contextMenuRenameItem, res => {
    // Si existe un nuevo nombre
    if (res) {
      api.fs(item.id, (err, fsNode) => {
        // Renombrar
        fsNode.rename(res, err => {
          if (err) return console.log(err) // En caso de error
          if (err) alert(`${lang.contextMenuRenameItemERROR} ${item.type}: ${err}`) // En caso de error
          api.fs(item.id, (err, fsNode) => {
            // Almacenar el elemento
            const el = $(`div[idhorbito='${item.id}']`).html()
            // Romper los elementos internos y obtener el nombre (texto !== </elements>)
            const name = $(`div[idhorbito='${item.id}']`).text()
            // Reemplazar nombre
            $(`div[idhorbito='${item.id}']`).html(el.replace(name, fsNode.name))
          })
        })
      })
    }
  })
}

// [Folder|File] Delete
function deleteItem (item) {
  // Mensaje de confirmacion sobre la eliminacion de unarchivo/directorio
  confirm(`${lang.contextMenuDeleteItem} ${item.type}?`, res => {
    if(res) {
      api.fs(item.id, (err, fsNode) => {
        fsNode.remove((err, response) => {
          if (err) alert(`${lang.contextMenuDeleteItemERROR} ${item.type}: ${err}`) // En caso de error
          if (err) return console.log(err) // En caso de error
          // Remover item del sidebar
          $(`div[idhorbito='${item.id}']`).animate({ left: '25px'}, 100).animate({ left: '-500px'}, 200)
          // Esperar unos segundos para eliminar el elemento, de forma que el efecto ocurra sin problemas
          setTimeout(() => {
            $(`div[idhorbito='${item.id}']`).parent().parent().remove()

            // Si no hay carpetas en el Sidebar ocultarlo
            closeSidebar($('.sidebar').children()[0] === undefined)
          }, 310)
          // En caso de estar abierto el archivo, establecerlo como "fuera de la horbita"
          filesOpened.forEach(e => {
            if (e.id === item.id) e.horbiting = false
          })
        })
      })
    }
  })
}

// [Folder] Close
function closeFolder (item) {
  // Mensaje de confirmacion sobre la remocion del directorio
  confirm(`${lang.contextMenuCloseFolderSidebar} ${item.type}?`, res => {
    if(res) {
      // Remover item del sidebar
      $(`div[idhorbito='${item.id}']`).animate({ left: '25px'}, 100).animate({ left: '-500px'}, 200)
      // Esperar unos segundos para eliminar el elemento, de forma que el efecto ocurra sin problemas
      setTimeout(() => {
        $(`div[idhorbito='${item.id}']`).parent().parent().remove()
        
        // Si no hay carpetas en el Sidebar ocultarlo
        closeSidebar($('.sidebar').children()[0] === undefined)
      }, 310)

    }
  })
}

// fsRead: Lee un archivo de Horbito
// listFolderAndClickItem: Al hacer click en una carpeta del sibar, la lista (desplega) y en un archivo lo abre :)
// saveFile: Al hacer click sobreescribe el archivo y salva los cambios
// saveFileAs: Al hacer click te pide la ubicacion de donde salvar los cambios del archivo
export { fsRead, listFolderAndClickItem, saveFile, saveFileAs }
