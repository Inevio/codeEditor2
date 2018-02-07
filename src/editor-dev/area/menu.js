'use strict'

// Opciones del menu y creacion de una nueva zona de edicion
import { barOpts } from '../config.js'

// Eventos en la barra de navegacion
// Click en un item
function clickItems(subClass, item) {
  // Ocultar todos los sub-menus
  hideItems(barOpts)
  // Al cliquear algun item, mostrar su respectivo sub-menu
  $(`.${item}`).click(() => {
    // Si el elemento esta oculto
    if ($(`.${subClass}`).css('display') === 'none') {
      // Ocultar todos los sub-menus cuando se le da click a otro item (y luego mostrar el sub-menu respectivo)
      hideItems(barOpts)
      // Mostrarlo
      $(`.${subClass}`).show()
    } else {
      // Si no, ocultarlo
      $(`.${subClass}`).hide()
    }
  })
}

// Ocultar items
function hideItems(opts) {
  // Recorrer el JSON en busca de las sub-clases
  opts.forEach(element => {
    // Ocultar todos los elementos que coincidad con las sub clases encontradas
    $(`.${element.subClass}`).hide()
  })
}

// Clickeando fuera del sub-menu y ocultar menu desplegado
function clickingOutside(area) {
  $(`.${area}`).click(() => {
    // Al hacer click en el "area", ocultar los sub-menus
    hideItems(barOpts)
  })
}

// Ocultar menu desplegado
clickingOutside('container')
clickingOutside('ui-header')

// clickItems: Desplega un sub menu al clickear un item de menu padre (por ejemplo, el principal)
export { clickItems }
