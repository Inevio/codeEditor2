'use strict'

// CodeMirror
import CodeMirror from '../cm/lib/codemirror.js'
// Utilidades
import { listUL, itemLIBar, itemLIHorbitoTab, itemLIHorbitoTextarea, FileCreator, filesOpened } from './utils.js'
// Eventos del menu
import { clickItems } from './area/menu.js'
// Code: Edicion
import { addFocus, closeTabs, hideTextareas, enableClicksOnTabs } from './area/code.js'

// Menu:
// Renderiza el menu basado en el objeto de opciones
function navigationBar (barOpts) {
  // [UL] Crear lista desordenada
  listUL('navigation', 'nav')

  // File, Edit, View, ...
  barOpts.forEach(element => {
    // [LI] Crear items dentro de UL
    itemLIBar('nav', 'item', element.id, element.name)

    // En caso de existir un sub-menu
    if (element.sub) {
      // [UL] Crear lista desordenada
      listUL(element.id, element.subClass)

      // New File, Open File, Open Folder...
      element.sub.forEach(subElement => {
        // [LI] Crear items dentro de UL
        if (subElement.idEvent) {
          // subElement.idEvent: Id del evento a ejecutar dentro de Horbito
          itemLIBar(element.subClass, `item ${subElement.idEvent}`, subElement.id, subElement.name)
        } else {
          itemLIBar(element.subClass, 'item', subElement.id, subElement.name)
        }
      })
    }
  })

  // Desplegar menus
  clickItems('sub-menu-file', 'menu-file') // File
  clickItems('sub-menu-edit', 'menu-edit') // Edit
  // Continuar con el resto de items...
}


// Code: Edicion
// Renderiza una nueva area de edicion (pestana y area de texto)
function newFile (id, name, config) {
  // Agregar un objeto (que representa a un archivo) al arreglo "Archivos Abiertos"
  filesOpened.push(new FileCreator(id, name))

  // Adjuntar tab en el editor (en el HTML)
  itemLIHorbitoTab('tabs', 'tab', id, name, 'icon-close')

  // Agregar ON a la tab que se crea segun su ID
  addFocus(id)

  // Ocultar todos los textareas NO RELACIONADOS a la nueva tab
  hideTextareas(id)

  // Adjuntar textarea-div en el editor (en el HTML)
  itemLIHorbitoTextarea('text', id)

  // CodeMirror
  // config: Es un objeto de configuraciones para CodeMirror
  let editor = CodeMirror($(`.myTextArea-${id}`)[0], config)

  // Habilitar clicks en las pestanas
  // Agregar focus a los tabs seleccionados
  enableClicksOnTabs()

  // Habilitar funcion para cerrar las pestanas y textareas
  closeTabs()
}

// Code: Sidebar
function sidebar (filesOpts) {

  // Crear lista desordenada [UL]
  listUL('sidebar', 'base')
  
  filesOpts.forEach(file => {
    // Crear items en una lista (Tab, CodeMirror y Sidebar)
    if (file.type !== 3) {
      itemLIHorbitoSidebar('base', 'item', file.id, 'icon-folder', file.name)
    } else {
      itemLIHorbitoSidebar('base', 'item', file.id, 'icon-file', file.name)
    }
  })

  // Mostrar Sidebar
  $('.sidebar').show()
  $('.code').css('width', '80%')
}

// navigationBar: Renderiza el menus
// newFile: Renderiza un nuevo espacio de trabajo, es decir, abre un nuevo (o creado) archivo
export const render = {
  navigationBar,
  sidebar,
  newFile
}
