function timer(){
  interval_timer = setInterval(function() {

      var timer2 = $('#timer').text();
      var timer = timer2.split(':');
      //by parsing integer, I avoid all extra string processing
      var minutes = parseInt(timer[0],10);
      var seconds = parseInt(timer[1],10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      if (minutes < 0) { gameOver()};
      seconds = (seconds < 0) ? 59 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      $('#timer').text(minutes + ':' + seconds);
  }, 1000);
}
