/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
    this.modelo = modelo;
    this.controlador = controlador;
    this.elementos = elementos;
    var contexto = this;
  
    // suscripción de observadores
    this.modelo.preguntaAgregada.suscribir(function() {
      contexto.reconstruirLista();
    });
  
    this.modelo.preguntaBorrada.suscribir(function() {
      contexto.reconstruirLista();
    });
  
    this.modelo.preguntaEditada.suscribir(function(){
      contexto.reconstruirLista();
    });
  
    this.modelo.preguntasTodasBorradas.suscribir(function(){
      contexto.reconstruirLista();
    });
  };
  
  
  VistaAdministrador.prototype = {
    //lista
    inicializar: function() {
      //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
      this.limpiarFormulario();
      this.reconstruirLista();
      this.configuracionDeBotones();
    },
  
    construirElementoPregunta: function(pregunta){
      var contexto = this;
      var nuevoItem;
      //completar
      //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
      nuevoItem = $("<li>").addClass("list-group-item");
      nuevoItem.attr("id",pregunta.id);
  
      var interiorItem = $('.d-flex');
      var titulo = interiorItem.find('h5');
      titulo.text(pregunta.textoPregunta);
  
      console.log(pregunta);
  
      var textoRespuestas = "";
      for (var i = 0; i < pregunta.cantidadPorRespuesta.length; i++) {
        textoRespuestas += pregunta.cantidadPorRespuesta[i] + ", ";
      }
      console.log(textoRespuestas);
      
      interiorItem.find('small').text(textoRespuestas);
      nuevoItem.html($('.d-flex').html());
      return nuevoItem;
    },
  
    reconstruirLista: function() {
      var lista = this.elementos.lista;
      lista.html('');
      var preguntas = this.modelo.preguntas;
      if (preguntas != null) {
        for (var i=0;i<preguntas.length;++i){
          lista.append(this.construirElementoPregunta(preguntas[i]));
        }
      }
    },
  
    configuracionDeBotones: function(){
      var e = this.elementos;
      var contexto = this;
  
      //asociacion de eventos a boton
      e.botonAgregarPregunta.click(function() {
        var value = e.pregunta.val();
        var respuestas = [];
  
        $('#respuesta [name="option[]"]').each(function(index) {
          //completar
          if ($(this).val() != '') {
            respuestas.push($(this).val());
          }
        });
  
        contexto.limpiarFormulario();
        contexto.controlador.agregarPregunta(value, respuestas);
      });
  
      e.botonAgregarRespuesta.click(function(){
        $('#respuesta').append('<input type="text" class="form-control" name="option[]" />');
      });
  
      //asociar el resto de los botones a eventos
      e.botonEditarPregunta.click(function(){
        var pregunta = $('.list-group-item.active').attr('id');
        if (pregunta != undefined) var preguntaNueva = window.prompt('Edite la pregunta');
        if (preguntaNueva != '' && preguntaNueva != null) contexto.controlador.editarPregunta(pregunta, preguntaNueva);
      });
  
      e.botonBorrarPregunta.click(function(){
        var pregunta = $('.list-group-item.active').attr('id');
        contexto.controlador.borrarPregunta(pregunta);
      });
  
      e.borrarTodo.click(function(params){
        contexto.controlador.borrarTotalPreguntas();
      });
    },
  
    limpiarFormulario: function(){
      $('.form-group.answer.has-feedback.has-success').remove();
    },
  };

///// ============================================================================
/*
 * Vista usuario
 */
var VistaUsuario = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaBorrada.suscribir(function(){
    contexto.reconstruirLista();
    contexto.reconstruirGrafico();
  });

  this.modelo.votoAgregado.suscribir(function(){
    contexto.reconstruirGrafico();
  });

  this.modelo.preguntasTodasBorradas.suscribir(function(){
    contexto.reconstruirLista();
    contexto.reconstruirGrafico();
  });

  this.modelo.preguntaEditada.suscribir(function(){
    contexto.reconstruirLista();
  });
};

VistaUsuario.prototype = {
  //muestra la lista por pantalla y agrega el manejo del boton agregar
  inicializar: function() {
    this.reconstruirLista();
    var elementos = this.elementos;
    var contexto = this;
    
    elementos.botonAgregar.click(function() {
      contexto.agregarVotos(); 
    });
      
    this.reconstruirGrafico();
  },

  //reconstruccion de los graficos de torta
  reconstruirGrafico: function(){
    var contexto = this;
    //obtiene las preguntas del local storage
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(function(clave){
      var listaParaGrafico = [[clave.textoPregunta, 'Cantidad']];
      var respuestas = clave.cantidadPorRespuesta;
      respuestas.forEach (function(elemento) {
        listaParaGrafico.push([elemento.textoRespuesta,elemento.cantidad]);
      });
      contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
    })
  },


  reconstruirLista: function() {
    var listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    var contexto = this;
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(function(clave){
      //completar
      //agregar a listaPreguntas un elemento div con valor "clave.textoPregunta", texto "clave.textoPregunta", id "clave.id"
      listaPreguntas.append($('<div id="' + clave.id + '" value="' + clave.textoPregunta + '" >' + clave.textoPregunta + '</div>'));
      var respuestas = clave.cantidadPorRespuesta;
      contexto.mostrarRespuestas(listaPreguntas,respuestas, clave);
    })
  },
  
  //muestra respuestas
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
      console.log(respuestas);
    });
  },

  agregarVotos: function(){
    var contexto = this;
    $('#preguntas').find('div').each(function(){
        var nombrePregunta = $(this).attr('value')
        var id = $(this).attr('id')
        var pregunta = contexto.modelo.obtenerPregunta(nombrePregunta);
        var respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
        $('input[name=' + id + ']').prop('checked',false);
        contexto.controlador.agregarVoto(pregunta,respuestaSeleccionada);
      });
  },

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

      var options = {
        title: nombre,
        is3D: true,
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
};