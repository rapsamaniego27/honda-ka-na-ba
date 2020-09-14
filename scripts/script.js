$( document ).ready(function() {

  /*HOME*/
  $('#home-play').click(function(){

    $('#home-box').addClass('modal-hide')
    $('#home-overlay').addClass('modal-hide');

    const body = document.querySelector('body');
    body.classList.remove('body-home--state');

  });

  /*Slider*/
  
  questions = $('.quiz-slider:not(.quiz-hidden)').children().length;
  i = 0;
  grpCounter = 0;

  function goToSlide(i){
    quizSlide.css('margin-left', (-100*i) + '%');
  }

  $('#quiz-next').click(function(){
    i += 1;
    quizSlide = $('.quiz-slider:not(.quiz-hidden)');
    $('.correct').removeClass('correct-highlight');

    if(i>=questions){ 
      grpCounter += 1;

      if(grpCounter > $('.quiz-slider').length){
        grpCounter = 0;
        $('.quiz-slider:nth-child(1)').removeClass('quiz-hidden');
        i=0;
      }   
      quizSlide.next('.quiz-hidden').removeClass('quiz-hidden');
      $(".quiz-slider:not(.quiz-hidden):nth-child(" + grpCounter + ")").addClass('quiz-hidden');
      i=0;  /*Goes back to zero*/
    }

    console.log(grpCounter);
    console.log(i);
    goToSlide(i);

    effect = new Audio();
    effect.src = "sounds/swoosh.mp3";
    effect.play();
  });


  $('#quiz-back').click(function(){
    i -= 1;
    /*quizSlide = $('.quiz-slider:not(.quiz-hidden)');*/
    $('.correct').removeClass('correct-highlight');
    
    if(i<0){
      grpCounter -= 1;
      marginLeft = grpCounter +1;
      if(grpCounter <= $('.quiz-slider').length){
        $('.quiz-slider:not(.quiz-hidden)').prev('.quiz-hidden').removeClass('quiz-hidden'); 
        $(".quiz-slider:eq(" + marginLeft + ")").addClass('quiz-hidden');      
        i= questions - 1;
        $('.quiz-slider:not(.quiz-hidden)').css('margin-left', (-100*i) + '%');
      }
    }

    console.log(grpCounter);
    console.log(i);
    $('.quiz-slider:not(.quiz-hidden)').css('margin-left', (-100*i) + '%');

    effect = new Audio();
    effect.src = "sounds/swoosh.mp3";
    effect.play();
  });


  $('#btnReveal').click(function(e){
    e.preventDefault();
    $('.correct').addClass('correct-highlight');
  });

  $('#quiz-next').click(function(){
    quizWrapper = $('.quiz-wrap-next');

    quizWrapper.addClass('arrow-bounce-right');

    quizWrapper.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
      function(e){
        quizWrapper.removeClass('arrow-bounce-right');
      });

  trackRow = $('.track-row');
  trackRow.each(function(){
    if($(this).hasClass("track-hide")){
      $(this).removeClass("track-hide");
    }
  });

  });

  $('#quiz-back').click(function(){
    quizWrapper = $('.quiz-wrap-back');

    quizWrapper.addClass('arrow-bounce-left');

    quizWrapper.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
      function(e){
        quizWrapper.removeClass('arrow-bounce-left');
      });

  });

  modalBox = $('#modal-box'),
  modalOverlay = $('#modal-overlay');

  
  function hideModal(){
    modalBox.addClass('modal-hide');
    modalOverlay.addClass('modal-hide');
  }

  modalOverlay.click(function(){
    hideModal();
  });

  $('#modal-close').click(function(){
    hideModal();
    return false;
  });


/*Car Movements*/
  
  function winner(width){
    if(width >= 100){
      setTimeout(function(){
        console.log(width);
        $('#winner-box').removeClass('modal-hide'),
        $('#winner-overlay').removeClass('modal-hide');
        
        effect = new Audio();
        effect.src = "sounds/winner.mp3";
        effect.play();

      }, 1200);
      
      $('#winner-overlay').click(function(){
        $('#winner-box').addClass('modal-hide'),
        $('#winner-overlay').addClass('modal-hide');
      });
    }
  }


  function forwardCar(){
    $('.track-inc').click(function(e){
    e.preventDefault();
    
    car = $(this).closest('div.track-box').next().find("img");
    level = $(this).closest('div.track-box').next().find("div");
    widthPercent = Math.round(level.width() / level.parent().width() * 100);

    car.css('left', (10 + widthPercent - 2) + '%');
    level.css('width', (10 + widthPercent) + '%');

    console.log((10 + widthPercent) + '%');

    effect = new Audio();
    effect.src = "sounds/car-horn.mp3";
    effect.play();

    totalWidth = 10 + widthPercent;
    winner(totalWidth);

    });
  }

  function backwardCar(){
    $('.track-dec').click(function(){
    car = $(this).closest('div.track-box').next().find("img");
    level = $(this).closest('div.track-box').next().find("div");
    widthPercent = Math.round(level.width() / level.parent().width() * 100);

    car.css('left', ((widthPercent - 10) - 2) + '%');
    level.css('width', (widthPercent - 10) + '%');

    console.log((widthPercent - 10) + '%');
    
    });
  }

  function nitros(){
    $('.nitros').click(function(){
    /*Variables*/

    car = $(this).closest('div.track-box').next().find("img");
    level = $(this).closest('div.track-box').next().find("div");
    widthPercent = Math.round(level.width() / level.parent().width() * 100);
    credits = $(this).closest('div.track-box').find('.nitros-credit');

    /*Parsing process*/
    parseCredits = parseInt(credits.text());
    
    /*Check if no more credits*/
    if(parseCredits <= 0){
      modalBox.removeClass('modal-hide');
      modalOverlay.removeClass('modal-hide');
      return false;
    }else{
      parseCredits-- ;
      credits.html(parseCredits);

      car.css('left', (5 + widthPercent - 2) + '%');
      level.css('width', (5 + widthPercent) + '%');

      effect = new Audio();
     effect.src = "sounds/nitros.mp3";
     effect.play();

     totalWidth = 10 + widthPercent;
     winner(totalWidth);
    }

    });
  }

  function reverse(){

    $('.reverse').mousedown(function(){
      laneId = $(this).attr('id').toString();
      lane = $('#' + laneId);
    });

    $('.reverse').draggable({
      containment:'.track',
      helper:'clone',
      revert:true,
    });

    $('.track-lane').droppable({
      hoverClass: 'track-border',
      tolerance:'fit',
      over: function(event, ui) {
            ui.helper.remove();
        }
    },{drop: function(){
      car = $(this).find("img");
      level = $(this).find('div');
      widthPercent = Math.round(level.width() / level.parent().width() * 100);
      credits = $('.track-box').find(lane).find('span');

      /*Parsing process*/
      parseCredits = parseInt(credits.text());

      if(parseCredits > 0){
        parseCredits-- ;
        credits.html(parseCredits); 
        car.css('left', ((widthPercent - 10) - 2) + '%');
        level.css('width', (widthPercent - 10) + '%');

        console.log((widthPercent - 10) + '%');

        if(parseCredits == 0){
          effect = new Audio();
          effect.src = "sounds/exb.mp3";
          effect.play();
        }else{
          effect = new Audio();
          effect.src = "sounds/reverse.mp3";
          effect.play();
        }
        
      }else{
        modalBox.removeClass('modal-hide');
        modalOverlay.removeClass('modal-hide');
        return false;        
      }


    } });
  }

  function police(){
    $('.police').mousedown(function(){
      laneId = $(this).attr('id').toString();
      lane = $('#' + laneId);
    });

    $('.police').draggable({
      containment:'.track',
      helper:'clone',
      revert:true,
    });

    $('.track-lane').droppable({
      hoverClass: 'track-border',
      tolerance:'fit',
      over: function(event, ui) {
            ui.helper.remove();
        }
    },{drop: function(){
      track = $(this).parent();
      credits = $('.track-box').find(lane).find('span');
      /*Parsing process*/
      parseCredits = parseInt(credits.text());

      if(parseCredits > 0){
        track.addClass('track-hide');
        parseCredits-- ;
        credits.html(parseCredits); 

        effect = new Audio();
        effect.src = "sounds/police.mp3";
        effect.play();

        policeBox = $('#police-box'),
        policeOverlay = $('#police-overlay');
        
        policeBox.removeClass('modal-hide');
        policeOverlay.removeClass('modal-hide');

        setTimeout(function(){
          policeBox.addClass('modal-hide'),
          policeOverlay.addClass('modal-hide');
        }, 1500);

      }else{

        modalBox.removeClass('modal-hide');
        modalOverlay.removeClass('modal-hide');
        return false;

      }


    } });
  }


  $('.reverse').mousedown(function(){
    reverse();
  });

  $('.police').mousedown(function(){
    police();
  });

  
  /*congratulate();*/
  nitros(); 
  forwardCar();
  backwardCar();



});
