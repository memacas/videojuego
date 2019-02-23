//Variables globales
var nCols = 7;
var tablero = new Array(nCols); //Tablero que contiene todos los dulces en una matriz
var tableroEliminar = {}; //Se almacenan los dulces en una matriz que se eliminaran posteriormente
var xIni, yIni; //Posicion fila/columna de cada dulce
var dulces = [1,2,3,4]; //Los diferentes dulces que hay
var nDistancia = {1: 114, 2:90, 3: 97, 4: 100, 5: 100} //Distancia entre cada fila para la animacion de la lluvia de dulces
var duracionAnimLluvia = 500;
var tiempoEnCorrerRecorrer = 0;
var pulsateEliminar = 300;
var fadeOutEliminar = 300;
//Cambia el color del titulo con animacion
function cambiarColorTitulo(){
  var claseActual = "main-titulo"
  var nuevaClase = "main-titulo-chg";
  var demora = 2000;
  if ($("#titulo_principal").hasClass(nuevaClase)){
    claseActual = nuevaClase;
    nuevaClase = "main-titulo-chg";
    var demora = 500;
  }
  $("#titulo_principal").toggleClass(nuevaClase).delay(demora).promise().done(cambiarColorTitulo);
}


function stopAllTimeouts()
{
    var id = window.setTimeout(null,0);
    while (id--)
    {
        window.clearTimeout(id);
    }
}




//Crear tablero (matriz) inicial de dulces (solo para datos)
function crearMatrizInicial(){
  for (var x=0; x < nCols; x++){
    tablero[x] = new Array(nCols);
    for (var y=0; y < nCols; y++){
      var azar = Math.floor(Math.random() * (dulces.length)) + 1;
      tablero[x][y] = azar;
    }
  }
}


$(function(){


  //Funcion que inicializa el Grag & Drop para la clase dulce
  function dragDrop(){
    $("div.dulce").draggable({
            revert: "invalid",
            axis: "x, y"
    });
    $("div.dulce").droppable({
            drop: function (event, ui) {
                    var dulceMovido = ui.draggable;
                    var dulceReemplazado = $(this);
                    var crearMovimiento = false;
                    var enEje;
                    //Comprueba si el movimiento es sobre la misma columna (filas)
                    if(Math.abs(dulceMovido.attr('y') - dulceReemplazado.attr('y')) == 1){
                      crearMovimiento = true;
                      enEje = 'y';
                      var top;
                      //Verifica que el dulce se haya movido hacia arriba o abajo
                      if (dulceMovido.attr('posTop') < dulceReemplazado.attr('posTop') ) top = "-=" + (  dulceMovido.height()) + "px";
                      else top = "+=" + (  dulceMovido.height()) + "px";
                      //Mueve el dulce que se va a reemplazar
                      $(this).animate({top:top}, 800);
                    }
                    //Comprueba si el movimiento es sobre la misma fila (columnas)
                    else if(Math.abs(dulceMovido.attr('x') - dulceReemplazado.attr('x')) == 1){
                      crearMovimiento = true;
                      enEje = 'x';
                      var left = dulceMovido.attr('posLeft') - dulceReemplazado.attr('posLeft');
                      //Verifica que el dulce se haya movido hacia izquierda o derecha
                      if (left > 0) left = "+=" + left + "px";
                      else left = "-=" + (-left) + "px";
                      //Mueve el dulce que se va a reemplazar
                      $(this).animate({left:left}, 800);
                   }else{
                     //Si el dulce se mueve a mas de un espacio, o no se posiciona en otro dulce, el movimiento se cancelara
                     dulceMovido.draggable({ revert: true });
                   }

                   //Si el dulce se movio un espacio, bien sea en sentido de filas o de columnas
                   if(crearMovimiento){
                     //Se crea el dulce movido (el que se arrastro con el mouse)
                     var dulceMovidoCopy = $('<div class="dulce" valor="'+dulceMovido.attr('valor')+'"><img src="image/' + dulceMovido.attr('valor') + '.png" /></div>');
                     //Se crea el dulce se va a reemplazar
                     var dulceReemplazadoCopy = $('<div class="dulce" valor="'+dulceReemplazado.attr('valor')+'"><img src="image/' + dulceReemplazado.attr('valor') + '.png" /></div>');
                     //Se obtiene el dulce previo al dulce movido. Para saber a donde mover el dulce reemplazado
                     var newPosReemplazado = $('.dulce[x='+dulceMovido.attr('x')+'][y='+dulceMovido.attr('y')+']').prev();
                     //Se obtiene el dulce previo al dulce reemplazado. Para saber a donde mover el dulce movido
                     var newPosMovido = $('.dulce[x='+dulceReemplazado.attr('x')+'][y='+dulceReemplazado.attr('y')+']').prev();

                     //Verifica si el movimiento fue entre columnas
                     if (enEje == 'x'){
                       if(dulceMovido.attr('y') < 7){
                         //Se inserta el dulce movido y reemplazado en las nuevas posiciones si existe un dulce previo
                         newPosMovido.after(dulceMovidoCopy);
                         newPosReemplazado.after(dulceReemplazadoCopy);
                       }
                       else{
                         //Se inserta el dulce movido y reemplazado en las nuevas posiciones si es el primer dulce
                         dulceReemplazado.parent().prepend(dulceMovidoCopy);
                         dulceMovido.parent().prepend(dulceReemplazadoCopy);
                       }
                     }

                     //Verifica si el movimiento fue entre filas
                     if (enEje == 'y'){
                       if(dulceMovido.attr('y') == 7){
                         //Se inserta el dulce movido y reemplazado en las nuevas posiciones si es el primer dulce
                         dulceReemplazado.parent().prepend(dulceMovidoCopy);
                         dulceMovido.parent().prepend(dulceReemplazadoCopy);
                       }
                       else if(dulceMovido.attr('y') == 6 && dulceReemplazado.attr('y') == 7){
                         //Se inserta el dulce movido y reemplazado en las nuevas posiciones si es el primer dulce
                         dulceMovido.parent().prepend(dulceReemplazadoCopy);
                         dulceReemplazado.parent().prepend(dulceMovidoCopy);
                       }
                       else{
                         //Se inserta el dulce movido y reemplazado en las nuevas posiciones si existe un dulce previo
                         newPosMovido.after(dulceMovidoCopy);
                         newPosReemplazado.after(dulceReemplazadoCopy);
                       }
                     }
                     //Se elimina el dulce reemplazado (div original)
                     dulceReemplazado.remove();
                     //Se elimina el dulce movido (div original)
                     dulceMovido.remove();

                     //Se crea el atributo de posicion top/left del dulce
                     dulceMovidoCopy.attr({'posLeft': dulceMovidoCopy.offset().left, 'posTop':dulceMovidoCopy.offset().top})
                     dulceReemplazadoCopy.attr({'posLeft': dulceReemplazadoCopy.offset().left, 'posTop':dulceReemplazadoCopy.offset().top})
                     //Se reinicializa porque hay nuevos dulces
                     dragDrop();
                     //Se reasignan posiciones (filas/columnas) de las columnas implicadas en el dragDrop
                     reordenar([dulceReemplazadoCopy.parent(), dulceMovidoCopy.parent()]);
                     //Se reordena el tablero principal con las nuevas coordenadas del movimiento
                     tablero[dulceReemplazadoCopy.attr('x')-1][dulceReemplazadoCopy.attr('y')-1] = parseInt(dulceReemplazadoCopy.attr('valor'));
                     tablero[dulceMovidoCopy.attr('x')-1][dulceMovidoCopy.attr('y')-1] = parseInt(dulceMovidoCopy.attr('valor'));
                     console.log('recorrer')
                     console.log(tablero);

                     //tiempoEnCorrerRecorrer = (duracionAnimLluvia * $('.dulce[nuevos]').length) + pulsateEliminar + fadeOutEliminar;
                     //setTimeout(function(){console.log("se recorre nuevamente");recorrer();},tiempoEnCorrerRecorrer)

                     recorrer();
                   }
            },
            over: function (event, ui) {},
            out: function (event, ui) {}
    });
  }


  $(".btn-reinicio").on("click", function(){
    if ($(this).hasClass('reiniciar')){
      //crearMatrizInicial();
      $('div.dulce').fadeOut(0).promise().done(function(){
        $('div.dulce').remove();
        tablero = new Array(nCols);
        crearMatrizInicial();
        llenarTablero({'tipo': 'inicial'});
        dragDrop();
        $(".btn-reinicio").text('Iniciar');
        $(".btn-reinicio").removeClass('reiniciar');
      });
    }else{
      recorrer ();
      $(this).text('Reiniciar');
      $(this).addClass('reiniciar');
    }
  });


  //Se recorren todos los dulces para marcarlos si tienen mas de 3 en linea
  function recorrer (){
    var tableroTemp = {} //Almacena temporalmente el tablero completo para ir marcando los dulces visitados
    var tableroTemp = tablero;
    var x=0, y=0;
    for (x=0; x<7; x++){
      for (y=0; y<7; y++){
        xIni = x + 1, yIni = y + 1;
        var dulce = tablero[x][y];
        if (dulce != -1)
          compararRecursivo ({'tableroTemp': tableroTemp, 'dulce': dulce, 'x': x , 'y':y});
        if (tableroEliminar[xIni + '_' + yIni] != undefined){
          if ((Object.keys(tableroEliminar[xIni + '_' + yIni]).length) >= 3){
          }else{
            delete tableroEliminar[xIni + '_' + yIni];
          }
        }
      }
    }
    //Se eliminan los dulces visualmente
    eliminarDivs();
  }

  //
  function reCrearMatriz(){
    //console.log()
    var colActual = "";
    var i = 0;
    $('div.dulce').each(function(){
      var dulce = $(this);
      if (colActual != dulce.parent().attr('class')) {
        colActual = dulce.parent().attr('class');
        i = 0;
      }
      dulce.attr({'x': dulce.parent().attr('x'),'y': (parseInt(dulce.parent().find('.dulce').length) - i)});
      tablero[dulce.attr('x')-1][dulce.attr('y')-1] = dulce.attr('valor');
      i++;
    })
    //console.log(tablero);
    llenarTablero({});
  }

  /*
  function crearMatrizInicial(){
    var dulces = [1,2,3,4];
    for (var x=0; x < nCols; x++){
      tablero[x] = new Array(nCols);
      for (var y=0; y < nCols; y++){
        var azar = Math.floor(Math.random() * (dulces.length)) + 1;
        tablero[x][y] = azar;
      }
    }
    */


  //Se compara recursivamente las lineas que formen los dulces de todo la pantalla
  function compararRecursivo(pRecParams){
    if (pRecParams['x'] < 0 || pRecParams['y'] < 0 || pRecParams['x'] >= nCols || pRecParams['y'] >= nCols) return;
    if (pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']] != pRecParams['dulce']) return
    pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']] = -1;
    if (tableroEliminar[xIni + '_' + yIni] == undefined)
      tableroEliminar[xIni + '_' + yIni] = new Array();
    tableroEliminar[xIni + '_' + yIni].push({'col': parseInt([pRecParams['x']])+1, 'fila': parseInt([pRecParams['y']])+1});
    pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']] = -1;
    compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'] + 1 , 'y': pRecParams['y']});
    compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'], 'y':pRecParams['y'] + 1});
    compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'] - 1 , 'y':pRecParams['y']});
    compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'] , 'y':pRecParams['y']-1});
  }

  //Se eliminan los dulces que se obtuvieron en el tableroEliminar
  function eliminarDivs(){
    if (Object.keys(tableroEliminar).length > 0){
      var key0 = Object.keys(tableroEliminar)[0];
      $.each(tableroEliminar[key0], function(key, val){
        var dulce = $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]');
        delete tableroEliminar[key0];
        delete tablero[val['col']-1][val['fila']-1];
        $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').addClass(key0);
        $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').addClass('eliminar');
      })
      $('div.dulce.'+key0).effect('pulsate', {}, pulsateEliminar).promise().done(function(){
        //Elimina todos los dulces del tablero visual
          if (Object.keys(tableroEliminar).length == 0) $('div.dulce.eliminar').fadeOut(fadeOutEliminar, function(){
          }).promise().done(function(){
            $('div.dulce.eliminar').remove();
            //Se llena el tablero con los dulces que quedaron
            reCrearMatriz();

            console.log("reCrearMatriz en eliminarDivs");
          });

          setTimeout(function(){
            //Se visita recursivamente el tableroEliminar para ir marcando los dulces por grupos
            eliminarDivs();
          }, 300)
      });
    }
  }

  //Establecer posiciones de Top y Left en cada dulce según su ubicación
  /*
  function rePosicionar(){
    $('.panel-tablero .dulce').each(function(){
      $(this).attr({'posLeft': $(this).offset().left, 'posTop': $(this).offset().top})
    })
  }
  */

  //Establecer a que fila y columna pertenece cada dulce, se hace cuando hacemos dragDrop
  function reordenar(padres){
    $.each(padres, function( index, padre) {
      var i = 7;
      padre.find('.dulce').each(function(){
        $(this).attr({'y': i, 'x': padre.attr('x')})
        i--;
      })
    })
  }

  //Cuando ya estan creados los dulces, hacer el efecto de lluvia para los dulces NUEVOS
  function lluviaDulces(lluviaParam){
    //console.log('col: ' + lluviaParam['colInicial'] + ', ' + $('.dulce[nuevos][y="'+lluviaParam['colInicial']+'"]').length)
    //console.log("en lluvia dulces: con y: " + lluviaParam['filaInicial'] + ", hay " + $('.dulce[nuevos][y="'+lluviaParam['filaInicial']+'"]').length + ' dulces nuevos');
    var duracionCaida = duracionAnimLluvia;
    $('.dulce[nuevos][y="'+lluviaParam['filaInicial']+'"]').each(function(){
      var dulce = $(this).removeAttr('nuevos').show();
      var tmp = $(this).clone().removeAttr('style');
      dulce.animate({top:lluviaParam['limiteinf'] + "px"}, duracionAnimLluvia, function(){
        $(this).css({position: 'static'});
        dragDrop();
      }).promise().done(function(){
        if (lluviaParam['filaInicial'] <= nCols){
          dulce.replaceWith(tmp);
          //Se crea el atributo de posicion top/left del dulce
          tmp.attr({'posLeft': tmp.offset().left, 'posTop': tmp.offset().top})
        }
      });
    }).promise().done(function(){
      //console.log('duracionCaida: ' + duracionCaida);
      setTimeout(function(){
        if (lluviaParam['filaInicial'] < nCols){
          //console.log('lluviaParam: ' +  lluviaParam['filaInicial']);
          if (lluviaParam['recurrencia']){
            lluviaDulces({'filaInicial': lluviaParam['filaInicial'] + 1,
                          'limiteinf': lluviaParam['limiteinf'] - nDistancia[lluviaParam['filaInicial']],
                          'recurrencia': lluviaParam['recurrencia']
                        });
          }
        }else return false;
      }, duracionCaida)
    })
  }

  // Crear dulces en modo Inicio/Reinicio para luego llamar a lluviaDulces() y mostrar el efecto
  function llenarTablero(llenarTableroParam){
    var seCreoDulceAd = false;
    var limiteIzq = 80;
    for (var x=1; x <= nCols; x++){
      for (var y=1; y <= nCols; y++){
        var crearDulce = true;
        if (tablero[x-1][y-1] == -1 || tablero[x-1][y-1] == null){
          tablero[x-1][y-1] = Math.floor(Math.random() * (dulces.length)) + 1;
        }else if(llenarTableroParam['tipo'] != 'inicial'){
          crearDulce = false;
          //console.log("Ya existe dulce en " + (x) + '|' + (y));
        }
        if (crearDulce){
          var num = tablero[x-1][y-1];
          var clase = '.col-' + x;
          var colDulce = $(clase);
          if(llenarTableroParam['tipo'] != 'inicial'){
            //console.log(tablero);
            //console.log('<div class="dulce" nuevos x="'+x+'" y="'+y+'" valor="'+num+'"><img src="image/' + num + '.png" /></div>');
          }
          seCreoDulceAd = true;
          var nuevoDiv = $('<div class="dulce" nuevos x="'+x+'" y="'+y+'" valor="'+num+'"><img src="image/' + num + '.png" /></div>').hide();
          nuevoDiv.css({position: 'absolute', top: 127, left: limiteIzq});
          nuevoDiv.find('img').css({width: '86%'})
          //Si es el 1er elemento de la columna
          if (colDulce.find('img').length == 0) colDulce.html(nuevoDiv);
          else{
            colDulce.find("div:first-of-type").before(nuevoDiv);
          }
        }
      }
      $('.col-' + x).attr('x', x);
      limiteIzq += 109;
    }
    //console.log(llenarTableroParam['tipo']);
    //console.log($('.dulce[nuevos][x="1"]').length)
    // Llamar al efecto de lluvia de dulces para mostrarlos al usuario
    if(llenarTableroParam['tipo'] == 'inicial'){
      lluviaDulces({'filaInicial': 1, 'limiteinf': 714, 'recurrencia': true});
    }
    else{
      //lluviaDulces({'filaInicial': 1, 'limiteinf': 714, 'recurrencia': true});
      /*
      duracionAnimLluvia = 1000;
      for (var i=1; i <= nCols; i++){
        console.log($('div.dulce[nuevos][y="'+i+'"]').length * duracionAnimLluvia);
        var limiteInf = 714;
        for(var i1 = 1; i1 <= i; i1++) limiteInf -= nDistancia[i1];
        lluviaDulces({'filaInicial': i, 'limiteinf': limiteInf, 'recurrencia': false});
      }*/
      //$('div.dulce[nuevos][y="3"]').show().delay(5000).promise().done(function(){});


      if(seCreoDulceAd) {
        tiempoEnCorrerRecorrer = (duracionAnimLluvia * $('.dulce[nuevos]').length) + pulsateEliminar + fadeOutEliminar;
        lluviaDulces({'filaInicial': 1, 'limiteinf': 714, 'recurrencia': true});
        console.log("tiempo en correr " + tiempoEnCorrerRecorrer);
        setTimeout(function(){console.log("se recorre nuevamente");recorrer();},tiempoEnCorrerRecorrer)
        //recorrer();
        //console.log('reCrearMatriz');
        //reCrearMatriz();
      }
    }
  }

  function llenarTableroOriginal(){
    var limiteIzq = 80;
    for (var x=1; x <= nCols; x++){
      var limiteinf = 714;
      for (var y=1; y <= nCols; y++){
        var num = tablero[x-1][y-1];
        var clase = '.col-' + x;
        //console.log(tablero[0][y-1] + "    khkjh")
        //console.log(clase);
        var colDulce = $(clase);
        var nuevoDiv = $('<div class="dulce" x="'+x+'" y="'+y+'" valor="'+num+'"><img src="image/' + num + '.png" /></div>');
        //nuevoDiv.css({position: 'relative', top: 0, left: limiteIzq})
        if (colDulce.find('img').length == 0){
          nuevoDiv.css({position: 'absolute', top: 0, left: limiteIzq});
          nuevoDiv.find('img').css({width: '80%'})
          //colDulce.html('<div class="dulce" x="'+x+'" y="'+y+'" valor="'+num+'"><img src="image/' + num + '.png" /></div>').hide();
          colDulce.html(nuevoDiv);
          //console.log(colDulce.find('.dulce[x="'+x+'"][y="'+y+'"]').offset().top);
          //console.log(colDulce.find('.dulce[x="'+x+'"][y="'+y+'"]').offset().left);
          nuevoDiv.animate({top:limiteinf + "px"}, 300, function(){
            $(this).css({position: 'static'});
          });
        }
        else{
          //alert("sdsa");
          //nuevoDiv.hide();
                  //nuevoDiv.offset({ top: 0, left: 30 });
          if (x==2 && false){
            nuevoDiv2 = nuevoDiv;
            $(document.body).append(nuevoDiv2);
            //nuevoDiv2.css({position: 'absolute', top: 703, left: limiteIzq})

            return false;
          }
          limiteinf -= 107;
          //console.log(limiteinf);
          colDulce.find("div:first-of-type").before(nuevoDiv);
          //nuevoDiv.css({position: 'relative', top: 0, left: limiteIzq})
          //nuevoDiv.animate({top:0 + "px"}, 5000);

          //nuevoDiv.slideDown();
        }
        //alert(colDulce);

        //$(clase).insert()
      }
      $('.col-' + x).attr('x', x);
      limiteIzq += 109;
    }
    rePosicionar();
    //console.log(tablero);
  }

  cambiarColorTitulo();
  crearMatrizInicial();
  llenarTablero({'tipo': 'inicial'});
  //console.log()
  duracionAnimLluvia = 50;
  tiempoEnCorrerRecorrer = duracionAnimLluvia * $('.dulce').length;
  setTimeout(function(){console.log("comenxar recorrer");recorrer();},tiempoEnCorrerRecorrer)
  dragDrop();
})
