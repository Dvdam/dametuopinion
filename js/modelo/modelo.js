/* ################### Modelo  ###################   */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;
  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
//===============================================================
  this.preguntaBorrada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.preguntasTodasBorradas = new Evento(this);
  this.votoAgregado = new Evento(this);  
//===============================================================
  this.cargarPreguntas();
};
//===============================================================
//===============================================================
Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
  var todosLosIds = [];
    for (var i = 0; i <  this.preguntas.length; i++)  {
      todosLosIds.push(this.preguntas[i].id);      
    }
    if(todosLosIds.length != 0){
      var max = todosLosIds.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return max;
    } else {
      return 0;
    }
  },
//===============================================================
//===============================================================
//se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
        var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': []};
        for (var i = 0; i < respuestas.length; i++) {
          nuevaPregunta.cantidadPorRespuesta.push({"textoRespuesta":respuestas[i],"cantidad":0});
        }
    this.preguntas.push(nuevaPregunta);
    this.guardar(this.preguntas);
    this.preguntaAgregada.notificar();
  },
//===============================================================
//===============================================================
  //se guardan las preguntas
  guardar: function(){
  var stringPreguntas = JSON.stringify(this.preguntas);
  localStorage.setItem("preguntas",stringPreguntas);
  },
//===============================================================
//===============================================================
  cargarPreguntas: function () {
    return this.preguntas = localStorage.getItem("preguntas") == null ? [] : JSON.parse(localStorage.getItem("preguntas"));
  },
//===============================================================
//===============================================================
  borrarPregunta: function(id){
    for (var i = 0; i <  this.preguntas.length; i++)  {
      if(this.preguntas[i].id == id){
        this.preguntas.splice(i,1);
        this.preguntaBorrada.notificar();
      }
    }
    this.guardar(this.preguntas);
  },
//===============================================================
//===============================================================
  editarPregunta: function (preguntaId, nombre) {
    for (var i = 0; i <  this.preguntas.length; i++)  {
      if(this.preguntas[i].id == preguntaId){
        this.preguntas[i].textoPregunta = nombre;
      }
    }
    this.guardar(this.preguntas);
    this.preguntaEditada.notificar();
  },
//===============================================================
//===============================================================
  agregarVoto: function (pregunta, respuestaTexto) {
    var respuestasDePregunta = pregunta.cantidadPorRespuesta
    for (var i = 0; i <  respuestasDePregunta.length; i++)  {
      if(respuestasDePregunta[i].textoRespuesta == respuestaTexto){
        respuestasDePregunta[i].cantidad += 1;
      }
    }
    this.guardar(this.preguntas);
    this.votoAgregado.notificar();
  },
//===============================================================
//===============================================================
  borrarTodasLasPreguntas: function () {
    this.preguntas = [];
    localStorage.clear();
    this.preguntasTodasBorradas.notificar();
  },
//===============================================================
//===============================================================
  obtenerPregunta: function (nombrePregunta) {
    for (var i = 0; i <  this.preguntas.length; i++)  {
      if(this.preguntas[i].textoPregunta == nombrePregunta){
        return this.preguntas[i];
      }
    }
  },
//===============================================================
//===============================================================
}; // Cierra Modelo.prototype
