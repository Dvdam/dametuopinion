/* ####################  Vista administrador ############################## */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  //===============================================================
  this.modelo.preguntaBorrada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntasTodasBorradas.suscribir(function() {
    contexto.reconstruirLista();
  });
  //===============================================================
};
//===============================================================
//===============================================================
VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
  //===============================================================
  this.limpiarFormulario();
  this.reconstruirLista();
  this.configuracionDeBotones();
  //===============================================================
  },
//===============================================================
//===============================================================
  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
  // //===============================================================
  //   nuevoItem = $("<li>").addClass("list-group-item");
  //   nuevoItem.attr("id",pregunta.id);
  //===============================================================
  //===============================================================
    var colores = ['#303f9f', '#03a9f4', '#4caf50', '#FF9800', '#ff5722']; // Varios Colores
    var color_Fondo = colores[Math.floor(Math.random() * colores.length)];

    nuevoItem = $("<li>").addClass("list-group-item");
    nuevoItem.attr("id",pregunta.id);
    nuevoItem.attr("id",pregunta.id).css('background', color_Fondo);
    //===============================================================
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    titulo.text(pregunta.textoPregunta).css('color','white');
  //===============================================================
  var textoRespuestas = "";
  for (var i = 0; i < pregunta.cantidadPorRespuesta.length; i++) {
    textoRespuestas += pregunta.cantidadPorRespuesta[i].textoRespuesta + ", ";
  }
  textoRespuestas = textoRespuestas.slice(0,-2);
  interiorItem.find('small').text(textoRespuestas);
  interiorItem.find('small').text(textoRespuestas).css('color','white');
  //===============================================================
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },
//===============================================================
//===============================================================
  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas === '0' ? null : this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },
//===============================================================
//===============================================================
  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
  //===============================================================
      // AGREGAR LAS PREGUNTAS    
      e.btnAgregarPregunta.click(function() {
        var value = e.pregunta.val();
        var respuestas = [];
        //completar
     var campoPregunta = $("#pregunta").val();
     var validaPregunta = /\w/;
      if(campoPregunta.length <= 3 || !validaPregunta.test(campoPregunta)){
      //  alert('Por favor ingresa el nombre de la PREGUNTA con mas de cuatro Letras!!!');
       swal({
        title: "Falta la Pregunta!",
        text: "Por favor ingresa el nombre de la PREGUNTA con mas de cuatro Letras!!!",
        icon: "warning",
        button: "Aceptar",
      })
       return false;
      } else {
        $('#respuesta [name="option[]"]').each(function(index) {
            if($(this).val() != ""){
              respuestas.push($(this).val());
            };
            //  console.log(respuestas);
        });
      };
        contexto.limpiarFormulario();
        contexto.controlador.agregarPregunta(value, respuestas);
      });
    //===============================================================
    //asociar el resto de los botones a eventos
       e.btnAgregarRespuesta.click(function () {
        var campoPregunta = $("#pregunta").val();
        var validaPregunta = /\w/;
         if(campoPregunta.length <= 3 || !validaPregunta.test(campoPregunta)){
          // alert('Por favor ingresa el nombre de la PREGUNTA con mas de cuatro Letras!!!');
          swal({
            title: "Falta la Pregunta!",
            text: "Por favor ingresa el nombre de la PREGUNTA con mas de cuatro Letras!!!",
            icon: "warning",
            button: "Aceptar!",
          })
          return false;
         } else {
        // console.log("Evento en el boton AgregarRespuesta");
        $("#respuesta").append('<input type="text" class="form-control" name="option[]" />');
         }
      });
    //===============================================================
        e.btnBorrarPregunta.click(function () {
        var seleccionado = false;
        $(".list-group-item.active").each(function(){
          $(this).attr('id');
          seleccionado = true;
        });
        if(!seleccionado){
          // alert('Por favor Selecciona una Pregunta para Eliminar!!!');
          swal({
            title: "Selecciona Una Pregunta!",
            text: "Por favor Selecciona una Pregunta para Eliminar!!!",
            icon: "warning",
            button: "Aceptar!",
          });
          return false;
        } else { 
          swal({
            title: "Estas seguro de eliminar la Pregunta?",
            text: "Una vez eliminada la pregunta, no las volveras a recuperar!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("La pregunta se elimino con éxito!", {
                icon: "success",
              });
              var preguntaSeleccionada = $(".list-group-item.active").attr("id");
              contexto.controlador.borrarPregunta(preguntaSeleccionada);
            } else {
              swal("Evitaste Eliminar la pregunta!");
            }
          });
        }
        });
      //===============================================================
        // EDITAR PREGUNTA
        e.btnEditarPregunta.click(function () {
          var seleccionado = false;
          $(".list-group-item.active").each(function(){
            $(this).attr('id');
            seleccionado = true;
          });
          if(!seleccionado){
            // alert('Por favor Selecciona una Pregunta para Editar!!!');
            swal({
              title: "Selecciona Una Pregunta!",
              text: "Por favor Selecciona una Pregunta para Editar!!!",
              icon: "warning",
              button: "Aceptar!",
            });
            return false;
          } else {  
            // console.log("Evento en el boton Editar Pregunta");
              var preguntaSeleccionada = $(".list-group-item.active").attr("id");
            if(preguntaSeleccionada != undefined){
              swal("Ingresa el Nuevo Nombre de la Pregunta:", {
                content: "input",
              })
              .then((nombreNuevo) => {
                swal(`La pregunta es: ${nombreNuevo}`);
                contexto.controlador.editarPregunta(preguntaSeleccionada, nombreNuevo);
              });
            }
          }
        });
      //===============================================================
              // BORRAR TODO
        e.borrarTodo.click(function (params) {
          // alert('Estas seguro de eliminar todo!!!');
            swal({
              title: "Estas seguro de eliminar todo?",
              text: "Una vez eliminadas todas las preguntas, no las volveras a recuperar!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then((willDelete) => {
              if (willDelete) {
                swal("Todas las preguntas fuerón Eliminadas!", {
                  icon: "success",
                });
                contexto.controlador.borrarTodasLasPreguntas();
              } else {
                swal("Evitaste Eliminar todas las preguntas!");
              }
            });
        })
  //===============================================================
},
//===============================================================
//===============================================================
  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
