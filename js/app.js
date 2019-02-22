function cambiarColorTitulo(){
  var claseActual = "main-titulo"
  var nuevaClase = "main-titulo-chg";
  var demora = 2000;
  if ($("#titulo_principal").hasClass(nuevaClase)){
    claseActual = nuevaClase;
    nuevaClase = "main-titulo-chg";
    var demora = 500;
  }
  //$("#titulo_principal").delay(2000).switchClass(claseActual, nuevaClase, 1000, "", cambiarColorTitulo );
  $("#titulo_principal").toggleClass(nuevaClase).delay(demora).promise().done(cambiarColorTitulo);
}

var nCols = 7;
var tablero = new Array(nCols);
var dulces = [1,2,3,4]
//alert(tablero.length);
function crearMatriz(){
  for (var x=0; x < nCols; x++){
    //console.log(x);
    tablero[x] = new Array(nCols);
    for (var y=0; y < nCols; y++){

      var azar = Math.floor(Math.random() * (dulces.length)) + 1;
      //console.log(azar + " fsdf");
      tablero[x][y] = azar;
    }
  }
  //console.log(tablero);
}

function llenarTablero(){
  for (var x=1; x <= nCols; x++){
    for (var y=1; y <= nCols; y++){
      var num = tablero[x-1][y-1];
      var clase = '.col-' + x;
      //console.log(tablero[0][y-1] + "    khkjh")
      //console.log(clase);
      var colDulce = $(clase);
      var nuevoDiv = '<div class="dulce" x="'+x+'" y="'+y+'" valor="'+num+'"><img src="image/' + num + '.png" /></div>';
      if (colDulce.find('img').length == 0){
        colDulce.html('<div class="dulce" x="'+x+'" y="'+y+'" valor="'+num+'"><img src="image/' + num + '.png" /></div>');
      }
      else{
        colDulce.find("div:first-of-type").before(nuevoDiv);
      }
      //alert(colDulce);

      //$(clase).insert()
    }
    $('.col-' + x).attr('x', x);
  }
  rePosicionar();
  console.log(tablero);
}

var tableroEliminar = {};
var tableroTemp = {}
var xIni, yIni;
//var tableroEliminar
function recorrer (){
  tableroTemp = tablero;
  var x=0, y=0;
  for (x=0; x<7; x++){
    for (y=0; y<7; y++){
      //tableroTemp[x][y] = -10;
      xIni = x + 1, yIni = y + 1;
      var dulce = tablero[x][y];
      if (dulce != -1)
        compararRecursivo ({'tableroTemp': tableroTemp, 'dulce': dulce, 'x': x , 'y':y});

      //console.log(xIni + '|' + yIni + ': ');

      if (tableroEliminar[xIni + '_' + yIni] != undefined){
        if ((Object.keys(tableroEliminar[xIni + '_' + yIni]).length) >= 3){
        //console.log(Object.keys(tableroEliminar[xIni + '|' + yIni]).length);
          //console.log(tableroEliminar[xIni + '|' + yIni]);
        }else{
          //console.log("remover " + xIni + '|' + yIni + ": " + tableroEliminar[xIni + '|' + yIni]);
          delete tableroEliminar[xIni + '_' + yIni];
        }
      }
      //return false;
    }
  }
  console.log("              ");
  console.log(tableroTemp);
  console.log(tableroEliminar);
  eliminarDivs();
}
function compararRecursivo(pRecParams){
  //console.log('dulce: ' + pRecParams['dulce'])
  if (pRecParams['x'] < 0 || pRecParams['y'] < 0 || pRecParams['x'] >= nCols || pRecParams['y'] >= nCols) return;
  //console.log('dulce: ' + pRecParams['dulce'] + ', ' + pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']])
  if (pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']] != pRecParams['dulce']) return
  //console.log(xIni + '|' + yIni + tableroEliminar[xIni + '|' + yIni] + ' col: ' + (parseInt([pRecParams['x']])+1) + ', fila: ' + (parseInt([pRecParams['y']])+1));
  pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']] = -1;
  if (tableroEliminar[xIni + '_' + yIni] == undefined)
    tableroEliminar[xIni + '_' + yIni] = new Array();
  tableroEliminar[xIni + '_' + yIni].push({'col': parseInt([pRecParams['x']])+1, 'fila': parseInt([pRecParams['y']])+1});
  //pRecParams['acum']++;
  pRecParams['tableroTemp'][pRecParams['x']][pRecParams['y']] = -1;
  //console.log("derecha")
  compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'] + 1 , 'y': pRecParams['y']});
  //console.log("superior")
  compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'], 'y':pRecParams['y'] + 1});
  compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'] - 1 , 'y':pRecParams['y']});
  compararRecursivo({'tableroTemp': pRecParams['tableroTemp'], 'dulce': pRecParams['dulce'], 'x': pRecParams['x'] , 'y':pRecParams['y']-1});
}

function eliminarDivs(){
  console.log("eliminar divs: " + (Object.keys(tableroEliminar).length));
  if (Object.keys(tableroEliminar).length > 0){
    var key0 = Object.keys(tableroEliminar)[0];
    console.log(key0);
    console.log(tableroEliminar[key0]);
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    $.each(tableroEliminar[key0], function(key, val){

      console.log("Eliminar x: " + (val['col']) + ', fila: ' + (val['fila']))
      var dulce = $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]');
      delete tableroEliminar[key0];

      delete tablero[val['col']-1][val['fila']-1];
      //$('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').remove();
      //$('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').css({'background-color': '#' + randomColor});
      //$('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').addClass(key0);
      $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').addClass(key0);
    })
    $('div.dulce.'+key0).effect('pulsate', {}, 1000).promise().done(function(){
      $('div.dulce.'+key0).fadeOut(1000).promise().done(function(){
        $('div.dulce.'+key0).remove();
        eliminarDivs();
      })


    });


  }

  /*
  $.each(tableroEliminar, function(key1, grupoDulce){
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    $.each(grupoDulce, function(key, val){
      console.log("Eliminar x: " + (val['col']) + ', fila: ' + (val['fila']) + ' ' + randomColor)
      var dulce = $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]');
      dulce.effect('pulsate', {}, 2000).delay(0).effect('pulsate', {}, 0, function(){
          //dulce.remove();
        delete tablero[val['col']-1][val['fila']-1];
        $('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').css({'background-color': '#' + randomColor});
        //$('div.dulce[x="'+(val['col'])+'"][y="'+(val['fila'])+'"]').remove();
        //console.log(tablero[val['col']][val['fila']] == undefined)
      });
    })
  })
  */
  //console.log(tablero);
}

function rePosicionar(){
  $('.panel-tablero .dulce').each(function(){
    var dulce = $(this);
    dulce.attr({'posLeft': dulce.offset().left, 'posTop':dulce.offset().top})
    //alert("fdfdf")
    //alert(dulce.attr('posLeft') + "    " + dulce.attr('posTop'));
  })
}

function reordenar(padres){
  $.each(padres, function( index, padre) {
    var i = 7;
    padre.find('.dulce').each(function(){
      var dulce = $(this);
      dulce.attr({'y': i, 'x': padre.attr('x')})
      //alert('padre: ' + padre.attr('x') + ', y: ' + dulce.attr('y') + ', x: ' + dulce.attr('x') )
      i--;
    })
  })
}

$(function(){
  function dragDrop(){
    $("div.dulce").draggable({
            revert: "invalid",
            axis: "x, y"
            //connectToSortable: '.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7'
    });
    $("div.dulce").droppable({
            drop: function (event, ui) {
                    var dulceMovido = ui.draggable;
                    //alert('x: ' + dulceMovido.attr('x') + ', y: ' + dulceMovido.attr('y'))
                    var dulceReemplazado = $(this);
                    //alert("dropped! y:" + $(this).attr('y') + ", x: " + $(this).attr('x'));
                    //alert(ui.draggable.attr('y') + ui.draggable.attr('x'));
                    //alert(Math.abs(dulceMovido.attr('y') - dulceReemplazado.attr('y')))
                    var crearMovimiento = false;
                    var enEje;
//Math.abs(dulceMovido.attr('y') - dulceReemplazado.attr('y')) > 1
                    if(Math.abs(dulceMovido.attr('y') - dulceReemplazado.attr('y')) == 1){
                      crearMovimiento = true;
                      enEje = 'y';
                       //var dulceReemplazadoCopy = dulceReemplazado.clone(true);
                       //alert('x: ' + dulceReemplazado.attr('x') + ', y: ' + dulceReemplazado.attr('y'))

                       //alert((ui.draggable.attr('posTop') - $(this).attr('posTop')) + ' - ' + dulceMovido.height())
                       //alert($(this).parent().attr("class"))
                       //alert(ui.draggable.attr('posLeft') - $(this).attr('posLeft'))
                      var top;
                      if (dulceMovido.attr('posTop') < dulceReemplazado.attr('posTop') ) top = "-=" + (  dulceMovido.height()) + "px";
                      else top = "+=" + (  dulceMovido.height()) + "px";
                      $(this).animate({top:top}, 800);
                    }
                    else if(Math.abs(dulceMovido.attr('x') - dulceReemplazado.attr('x')) == 1){
                      crearMovimiento = true;
                      enEje = 'x';
                     //var dulceReemplazadoCopy = dulceReemplazado.clone(true);
                     //alert('x: ' + dulceReemplazado.attr('x') + ', y: ' + dulceReemplazado.attr('y'))

                     //alert(ui.draggable.attr('posLeft') + " " +ui.draggable.position().left)
                     //alert($(this).parent().attr("class"))
                     //alert(ui.draggable.attr('posLeft') - $(this).attr('posLeft'))
                      var left = dulceMovido.attr('posLeft') - dulceReemplazado.attr('posLeft');
                      if (left > 0) left = "+=" + left + "px";
                      else left = "-=" + (-left) + "px";
                     //alert(left)
                      $(this).animate({left:left}, 800);
                   }else{
                     dulceMovido.draggable({ revert: true });
                   }

                   if(crearMovimiento){
                     var dulceMovidoCopy = $('<div class="dulce" valor="'+dulceMovido.attr('valor')+'"><img src="image/' + dulceMovido.attr('valor') + '.png" /></div>');
                     var dulceReemplazadoCopy = $('<div class="dulce" valor="'+dulceReemplazado.attr('valor')+'"><img src="image/' + dulceReemplazado.attr('valor') + '.png" /></div>');

                     var newPosReemplazado = $('.dulce[x='+dulceMovido.attr('x')+'][y='+dulceMovido.attr('y')+']').prev();
                     var newPosMovido = $('.dulce[x='+dulceReemplazado.attr('x')+'][y='+dulceReemplazado.attr('y')+']').prev();

                     if (enEje == 'x'){
                       if(dulceMovido.attr('y') < 7){
                         newPosMovido.after(dulceMovidoCopy);
                         newPosReemplazado.after(dulceReemplazadoCopy);
                       }
                       else{
                         dulceReemplazado.parent().prepend(dulceMovidoCopy);
                         dulceMovido.parent().prepend(dulceReemplazadoCopy);
                       }
                     }

                     if (enEje == 'y'){
                       if(dulceMovido.attr('y') == 7){

                         dulceReemplazado.parent().prepend(dulceMovidoCopy);
                         dulceMovido.parent().prepend(dulceReemplazadoCopy);
                       }
                       else if(dulceMovido.attr('y') == 6 && dulceReemplazado.attr('y') == 7){
                         dulceMovido.parent().prepend(dulceReemplazadoCopy);
                         dulceReemplazado.parent().prepend(dulceMovidoCopy);
                       }
                       else{
                         newPosMovido.after(dulceMovidoCopy);
                         newPosReemplazado.after(dulceReemplazadoCopy);
                       }
                     }

                     //alert(dulceMovidoCopy.parent())
                     //alert(dulceReemplazadoCopy.html())
                     //alert(newPosMovido.parent().attr('class'))
                     //alert(dulceMovidoCopy)
                     dulceReemplazado.remove();
                     dulceMovido.remove();
                     dulceMovidoCopy.attr({'posLeft': dulceMovidoCopy.offset().left, 'posTop':dulceMovidoCopy.offset().top})
                     dulceReemplazadoCopy.attr({'posLeft': dulceReemplazadoCopy.offset().left, 'posTop':dulceReemplazadoCopy.offset().top})
                     dragDrop();
                     //alert(dulceReemplazadoCopy.parent().attr('class'))
                     reordenar([dulceReemplazadoCopy.parent(), dulceMovidoCopy.parent()]);

                     tablero[dulceReemplazadoCopy.attr('x')-1][dulceReemplazadoCopy.attr('y')-1] = parseInt(dulceReemplazadoCopy.attr('valor'));
                     tablero[dulceMovidoCopy.attr('x')-1][dulceMovidoCopy.attr('y')-1] = parseInt(dulceMovidoCopy.attr('valor'));
                     console.log(tablero);
                     //alert('x: ' + dulceReemplazadoCopy.attr('x') + ', y: ' + dulceReemplazadoCopy.attr('y'))
                     //console.log(dulceMovidoCopy);

                   }
            },
            over: function (event, ui) {},
            out: function (event, ui) {}
    });
  }

  /*
  $( ".col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7" ).sortable({
    revert: true,
    axis: "y",
    stop: function(ev, ui) {
      var actualY = ui.item.attr('y');
      var prevY = ui.item.prev().attr('y');
      var nextY = ui.item.next().attr('y');
      if (prevY == undefined) prevY = parseInt(actualY) + 2;
      if (nextY == undefined) nextY = parseInt(actualY) + 2;

      alert('cur:' + actualY + ', anterior: ' + prevY);
      alert('cur:' + actualY + ', siguiente: ' + nextY);
      //alert(ui.item.prev().attr('y'));
      if (Math.abs(actualY -prevY) > 1 &&
          Math.abs(actualY - nextY) > 1) $(this).sortable('cancel');
      else{
        reordenar($(this));
      }

    }
  });
  */


  /*
  $('div.dulce').click(function(){
    var div = $(this);
    alert("x: " + div.attr('x') + ", y: " + div.attr('y'))
  })
  */

  /*
  $(".col-1").sortable({
      connectWith: ".col-2"
  })
      .disableSelection();

  $(".col-2").sortable({
      connectWith: ".col-1"
  })
      .disableSelection();

  $( ".col-2" ).data( "ui-sortable" ).floating = true;
  */

  /*
  src = null;
  options = {
      revert:true,
      axis: 'y',
      opacity: 0.8,
      start: function() {
          src = $(this).parent();
      }
  };

  $("div.dulce").draggable(options);
  $(".col-1").droppable({
      drop: function(event, ui) {
          src.append(
              $('div.dulce', this).remove().clone()
              .draggable(options)
          );

          $(this).append(
              ui.draggable.remove().clone()
              .draggable(options)
          );
      }
  });
  */

  cambiarColorTitulo();
  crearMatriz();
  llenarTablero();
  dragDrop();
  //eliminarDulces();
  recorrer ();
})
