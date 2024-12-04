¿Por qué elegiste esa API?
He elegido esta api ya que me parece algo que se usa dia a dia y es muy util para todo el mundo puedes ver tanto el clima de tu zona como el de donde quieras.
¿Qué problemas tuviste y cómo los solucionaste?
Tuve varios problemas uno fue que al moverme por el mapa no generaba el clima de donde me movia solo de donde recibia la ubicación 
El problema se solucionó utilizando el evento moveend en el mapa. Este evento se dispara cada vez que el mapa se mueve, y dentro de su manejador se llama a la función fetchLocalWeather(), que obtiene los lugares cercanos a la nueva ubicación del mapa y muestra su clima.

Pasos clave:
Evento moveend: Se agregó el evento para actualizar el clima cuando el mapa se mueve:

javascript
map.on('moveend', fetchLocalWeather);
Obtención dinámica del clima: Cada vez que se mueve el mapa, calculamos la nueva área visible (con map.getBounds()), y luego obtenemos los lugares cercanos a través de la API de OpenWeather.
Actualización del mapa: La función fetchLocalWeather() actualiza los marcadores y muestra el clima de las nuevas ciudades cercanas.
Esto asegura que el clima se actualice cada vez que el usuario mueva el mapa.

Otro problema fue que no eliminaba los marcadores de lugares cercanos al hacer zoom hacia atras y los mostraba a la vez que capitales
Para solucionar el problema de mostrar y ocultar los marcadores según el zoom, utilicé el evento zoomend y las funciones de limpieza de marcadores:

Evento zoomend: Detecta cuando se hace zoom y decide qué mostrar.
Funciones de limpieza:
clearMarkers() elimina los lugares cercanos.
clearCapitalMarkers() elimina las capitales.
Código simplificado:
javascript
map.on('zoomend', () => {
  const zoomLevel = map.getZoom();
  if (zoomLevel < 6) {
    fetchCapitalWeather();  // Mostrar capitales
    clearMarkers();         // Eliminar lugares cercanos
  } else {
    fetchLocalWeather();    // Mostrar lugares cercanos
    clearCapitalMarkers();  // Eliminar capitales
  }
});
Este código asegura que al hacer zoom hacia atrás se eliminen los lugares cercanos y se muestren las capitales, y viceversa al hacer zoom hacia adelante.

Algo que se podria mejorar es:
Guardar ubicación preferida:
Permitir que el usuario guarde su ubicación preferida o agregar un marcador especial para su ciudad favorita para poder consultarla más rápido.
Agregar una interfaz de búsqueda:
Buscar por ciudad o coordenadas: Permitir que los usuarios busquen lugares específicos para obtener información meteorológica en lugar de depender únicamente de la ubicación actual o de la vista del mapa.
Puedes agregar un cuadro de búsqueda donde el usuario pueda escribir el nombre de una ciudad y mostrar el clima de esa ciudad.
Mostrar más información del clima: Puedes agregar más detalles sobre el clima, como la humedad, la velocidad del viento, la sensación térmica y el pronóstico del clima para los próximos días.

La nota que me pondrias es de 8 ya que he conseguido hacer practicamente todo lo que tenia pensado
