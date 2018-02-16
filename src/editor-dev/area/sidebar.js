'use strict'

// Renderizado
import { render } from '../render.js'
// Utilidades
import { baseULHorbitoSidebarSUB, itemLIHorbitoSidebarSUB, filesOpened, changeArrow } from '../utils.js'

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
            itemLIHorbitoSidebarSUB(id, 'item', file.id, 'icon-folder', file.name, '<i class="icon-arrow-right"></i>')
            $('.icon-folder').parent().css('margin-left', '-20px') // Reajustar items de tipo carpeta
          } else {
            itemLIHorbitoSidebarSUB(id, 'item', file.id, 'icon-file', file.name)
          }
        }
      })
    }
  })
}

// Evento click sobre un archivo o carpeta en el Sidebar
$('.sidebar').on('dblclick', 'div[idhorbito]', function () {
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
        if ($($(`div[idhorbito='${id}']`).children()[1]).attr('class') === 'icon-folder') changeArrow($(this).children()[0]) // Cambio de flechas en el Sidebar
      } else { // En caso de no estarlo, listartla (desplegarla)
        listFolderAndClickItem(id)
        $(`div[idhorbito]`).removeClass('selected') // Remover la seleccion de todos los items
        if ($(`div[idhorbito='${id}']`).children().attr('class') === 'icon-file') $(`div[idhorbito='${id}']`).addClass('selected')
        if ($($(`div[idhorbito='${id}']`).children()[1]).attr('class') === 'icon-folder') changeArrow($(this).children()[0]) // Cambio de flechas en el Sidebar
      }
      click = 0
    }, 700)
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
    "id": Number($(this).attr('idhorbito')), 
    "type": () => {
      // Tipo: Folder|File
      let t = null

      // En caso de ser una carpeta, tendra un icono de flecha (cual hay que omitir) antes del "icon-folder"
      if ($(this).children().length === 2) {
        // Obtener el icono de directorio
        t = $(this).children()[1]
        // Obtener su clase: "icon-folder"
        t = $(t).attr('class')
      } else {
        // Obtener su clase: "icon-file"
        t = $(this).children().attr('class')
      }
      
      return t.split('-')[1]
    }
  }

  // Determinar si se trata de un archivo o un directorio
  if (item.type() === 'folder') { // En caso de ser una carpeta
    menu.addOption('New File', () => { newFileFolder(item.id) } )
    menu.addOption('New Folder', () => { newFolderFolder(item.id) } )
    menu.addOption('Rename', () => { renameItem(item) })
    menu.addOption('Delete', () => { deleteItem(item) })
  } else { // En caso de ser un archivo
    menu.addOption('Rename', () => { renameItem(item) })
    menu.addOption('Delete', () => { deleteItem(item) })
  }

  // Rendelizado del ContextMenu
  menu.render()
})

// [Folder] New File
function newFileFolder (id) {
  api.fs(id, (err, item) => {
    console.log('newFileFolder', item)
  })
}

// [Folder] New Folder
function newFolderFolder (id) {
  api.fs(id, (err, item) => {
    console.log('newFolderFolder', item)
  })
}


// [Folder|File] Delete
function renameItem (item) {
  prompt('Please, write the new name', res => {
    // Si existe un nuevo nombre
    if (res) {
      api.fs(item.id, (err, fsNode) => {
        // Renombrar
        fsNode.rename(res, err => {
          if (err) return console.log(err) // En caso de error
          if (err) alert(`There was an error trying to rename the ${item.type()}: ${err}`) // En caso de error
        
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

// [Folder|File] Rename
function deleteItem (item) {
  // Mensaje de confirmacion sobre la eliminacion de unarchivo/directorio
  confirm(`Are you sure you want to delete this ${item.type()}?`, res => {
    if(res) {
      api.fs(item.id, (err, fsNode) => {
        fsNode.remove((err, response) => {
          if (err) alert(`There was an error trying to delete the ${item.type()}: ${err}`) // En caso de error
          if (err) return console.log(err) // En caso de error
          // Remover item del sidebar
          $(`div[idhorbito='${item.id}']`).remove()
          // En caso de estar abierto el archivo, establecerlo como "fuera de la horbita"
          filesOpened.forEach(e => {
            if (e.id === item.id) e.horbiting = false
          })
        })
      })
    }
  })
}

// fsRead: Lee un archivo de Horbito
// listFolderAndClickItem: Al hacer click en una carpeta del sibar, la lista (desplega) y en un archivo lo abre :)
// saveFile: Al hacer click sobreescribe el archivo y salva los cambios
// saveFileAs: Al hacer click te pide la ubicacion de donde salvar los cambios del archivo
export { fsRead, listFolderAndClickItem, saveFile, saveFileAs }
