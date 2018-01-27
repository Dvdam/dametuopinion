/* ################### Controlador  ###################   */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  //===============================================================
            // #### BACK
  agregarPregunta: function(pregunta, respuestas) {
    this.modelo.agregarPregunta(pregunta, respuestas);
  },
  //===============================================================
  //===============================================================
  borrarPregunta: function (preguntaId) {
    this.modelo.borrarPregunta(preguntaId);
  },
  //===============================================================
  //===============================================================
  editarPregunta: function (preguntaId, nombre) {
    this.modelo.editarPregunta(preguntaId, nombre);
  },
  //===============================================================
  //===============================================================
  borrarTodasLasPreguntas: function () {
    this.modelo.borrarTodasLasPreguntas();
  },
  //===============================================================
  //===============================================================
            // #### FRONT
  //===============================================================
  //===============================================================
  agregarVoto: function(pregunta,respuestaTexto){
    this.modelo.agregarVoto(pregunta,respuestaTexto);
  },
  //===============================================================
  //===============================================================
  cargarPreguntas: function(){
    return this.modelo.cargarPreguntas();
  },
  //===============================================================
  //===============================================================

};
