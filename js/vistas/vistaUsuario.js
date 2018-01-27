/* ################### Vista usuario ###################   */
var VistaUsuario = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;
};
//===============================================================
//===============================================================

VistaUsuario.prototype = {
  //muestra la lista por pantalla y agrega el manejo del boton agregar
  inicializar: function() {
    this.reconstruirLista();
    var elementos = this.elementos;
    var contexto = this;
    elementos.btnAgregar.click(function() {
      contexto.agregarVotos();
    });
    this.reconstruirGrafico();
  },
//===============================================================
//===============================================================
  reconstruirGrafico: function(){
    var contexto = this;
    //obtiene las preguntas del local storage
    var preguntas = this.modelo.preguntas;
    if(preguntas != null){
      preguntas.forEach(function(clave){
        var listaParaGrafico = [[clave.textoPregunta, 'Cantidad']];
        var respuestas = clave.cantidadPorRespuesta;
        respuestas.forEach (function(elemento) {
          listaParaGrafico.push([elemento.textoRespuesta,elemento.cantidad]);
        });
        contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
      })
    }
  },
//===============================================================
//===============================================================
  reconstruirLista: function() {
    var listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    var contexto = this;
    var preguntas = this.controlador.cargarPreguntas(); // PASAMOS this.modelo.preguntas
    if(preguntas != null){
      preguntas.forEach(function(clave){
        //completar --  //agregar a listaPreguntas un elemento div con valor "clave.textoPregunta", texto "clave.textoPregunta", id "clave.id"
        var nuevaPregunta = $("<div>");
        nuevaPregunta.attr("value",clave.textoPregunta);
        nuevaPregunta.attr("id",clave.id);
        nuevaPregunta.html(clave.textoPregunta);
        listaPreguntas.append(nuevaPregunta);
        var respuestas = clave.cantidadPorRespuesta;
        contexto.mostrarRespuestas(listaPreguntas,respuestas, clave);
      })
    }
  },
//===============================================================
//===============================================================
  mostrarRespuestas:function(listaPreguntas,respuestas, clave){
    respuestas.forEach (function(elemento) {
      listaPreguntas.append($('<input>', {
        type: 'radio',
        value: elemento.textoRespuesta,
        name: clave.id,
      }));
      listaPreguntas.append($("<label>", {
        for: elemento.textoRespuesta,
        text: elemento.textoRespuesta
      }));
    });
  },
//===============================================================
// //muestra respuestas
//   mostrarRespuestas:function(listaPreguntas,respuestas, clave){
//     respuestas.forEach (function(elemento) {
//       listaPreguntas.append($('<input>', {
//         type: 'radio',
//         value: elemento.textoRespuesta,
//         name: clave.id,
//       }));
//       listaPreguntas.append($("<label>", {
//         for: elemento.textoRespuesta,
//         text: elemento.textoRespuesta
//       }));
//     });
//   },


//===============================================================
  agregarVotos: function(){
    var contexto = this;
    $('#preguntas').find('div').each(function(){
      //======================================================
      var usuario = $("#nombreUsuario").val();
      var validausuario = /^[A-Za-zñÑ-áéíóúÁÉÍÓÚ\s\t-]*$/;
      //======================================================
      var eleccion = $(this).attr('id')
      opciones = document.getElementsByName(eleccion);
      var seleccionado = false;
      for(var i=0; i<opciones.length; i++) {    
        if(opciones[i].checked) {
          seleccionado = true;
        }
      }
      if(usuario.length <= 2 || !validausuario.test(usuario)){
        // alert('Por favor ingresa un nombre con mas de cuatro Letras y Selecciona una Opcion de cada Pregunta!!!');
        swal({
          title: "El nombre es Obligatorio!",
          text: "Por favor ingresa un nombre con mas de tres Letras!!!",
          icon: "warning",
          button: "Aceptar!",
        });
        return false;
      } else {
          if(!seleccionado){
            // alert('Por favor ingresa un nombre con mas de cuatro Letras y Selecciona una Opcion de cada Pregunta!!!');
            swal({
              title: "Elegí una respuesta!",
              text: "Por favor selecciona una Opcion de cada Pregunta!!!",
              icon: "warning",
              button: "Aceptar!",
            });
            return false;
          } else {
            var nombrePregunta = $(this).attr('value')
            var id = $(this).attr('id')
            var pregunta = contexto.modelo.obtenerPregunta(nombrePregunta);
            var respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
            $('input[name=' + id + ']').prop('checked',false);
            contexto.controlador.agregarVoto(pregunta,respuestaSeleccionada);
          }
        }
      });
    contexto.reconstruirLista();
    contexto.reconstruirGrafico();
    // debugger;
  },
//===============================================================
//===============================================================
dibujarGrafico: function(nombre, respuestas){
  var seVotoAlgunaVez = false;
  for(var i=1;i<respuestas.length;++i){
    if(respuestas[i][1]>0){
      seVotoAlgunaVez = true;
    }
  }
  var contexto = this;
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(respuestas);
    var colores = ['#64DD17', '#76FF03','#FFFF00', '#FFEA00','#B2FF59','#00E676']; // Tonos Verdes
    var fondo_Grafico = colores[Math.floor(Math.random() * colores.length)];
    var options = {
      title: nombre,
      is3D: true,
      backgroundColor: fondo_Grafico,
    };
    var ubicacionGraficos = contexto.elementos.graficosDeTorta;
    var id = (nombre.replace(/\W/g, '')).split(' ').join('')+'_grafico';
    if($('#'+id).length){$('#'+id).remove()}
    var div = document.createElement('div');
    ubicacionGraficos.append(div);
    div.id = id;
    div.style.width = '400';
    div.style.height = '300px';
    var chart = new google.visualization.PieChart(div);
    if(seVotoAlgunaVez){
      chart.draw(data, options);
    }
  }
},
//===============================================================

};
