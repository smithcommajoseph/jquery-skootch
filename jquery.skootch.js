/**
 * jQuery Skootch: desc goes here
 * http://
 * 
 * @param p
 */
 
(function($) {
    $.fn.skootch = function(p) {
        var def = {
            trigger: '#skootch-trigger',
            invader: '#skootch-invader',
            wrapperIdSuffix: 'skootch-wrap'
        },
        params = $.extend(def, p),
        indigenewrap = $(this).attr('id')+'-'+params.wrapperIdSuffix;
        
        $(this).wrap(function() {
          return '<div id="'+indigenewrap+'" syle="position: relative;"/>';
        });
        
        
        var $indigen = this,
            $indigenewrapper = $('#'+indigenewrap),
            invaderWidth = $(params.invader).width();
        
        var clickHandler = function(e){
            $(params.trigger).unbind('.skootchEvents');
            
            if(typeof $(this).data('state') == 'undefined'){ $(this).data('state', 'Closed'); }
            
            if($(this).data('state') == 'Closed'){
                
                $(this).data('state', 'Open');
                
                var winwidth = $(window).width();
                var batwidth = $indigen.width();
                var gutterwidth = (winwidth - batwidth) / 2;
                
                // if(gutterwidth < 200){
                    var fullw = invaderWidth - gutterwidth;
                     var one4th = Math.floor(fullw * 0.25);
                     var three4th = one4th * 3; 
                     $('body').css({"overflow-x": "hidden"});
                     
                    $indigen.css('position', 'relative').animate({"left": "+="+invaderWidth }, "slow", function(){
                        // debug.log('categoryToggleOn animate closure 1');
                    });
                // } 
                
                $(this).removeClass('skootch-trigger-closed').addClass('skootch-trigger-active');
                $(params.invader).animate({"left": "+="+invaderWidth}, "slow", function(){
                    // debug.log('categoryToggleOn animate closure 2');
                    // debug.log($(this));
                    // rebind                   
                    $(params.trigger).bind('click.skootchEvents', clickHandler);
                });
                
            }
            else{
                // debug.log('toggle OFF');
                $(this).data('state', 'Closed');
                
                // if(gutterwidth < 200){        
                    $indigen.animate({"left": "-="+invaderWidth}, "slow", function(){
                        $('body').css({"overflow-x": "auto"});
                    });
                // }
                
                $(this).removeClass('skootch-trigger-active').addClass('skootch-trigger-closed');
                $(params.invader).animate({"left": "-="+invaderWidth}, "slow", function(){
                    // debug.log('categoryToggleOff animate closure 2');
                    // rebind
                    $(params.trigger).bind('click.skootchEvents', clickHandler);
                });
            }
            
        };
        
        return $(params.trigger).bind('click.skootchEvents', clickHandler);
        
    };
  
})(jQuery);