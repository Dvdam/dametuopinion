var modelo = new Modelo();
var vistaAdmin = new VistaAdministrador(modelo, new Controlador(modelo), {
  'lista': $('#lista'),
  'btnEditarPregunta': $('#editarPregunta'),
  'btnBorrarPregunta': $('#borrarPregunta'),
  'borrarTodo': $('#borrarTodo'),
  'pregunta': $('#pregunta'),
  'respuesta': $('#respuesta'),
  'formulario': $('localStorageForm'),
  'btnAgregarPregunta': $('#agregarPregunta'),
  'muestraDeRespuestas': $('.panel-body'),
  'btnAgregarRespuesta': $(".botonAgregarRespuesta"),
});
vistaAdmin.inicializar();
//==========================================================================
//==========================================================================
var vistaUsuario = new VistaUsuario(modelo, new Controlador(modelo), {
  'listaPreguntas': $('#preguntas'),
  'btnAgregar': $('#agregarBoton'),
  'nombreUsuario' : $('#nombreUsuario'),
  'graficosDeTorta' : $('#graficosDeTorta'),
});
vistaUsuario.inicializar();

