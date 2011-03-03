/**
 * jQuery Skootch: desc goes here
 * http://
 * 
 * @param f 
 * @param g 
 */
 
(function($) {
    $.fn.skootch = function(f,g) {
        
        var clickHandler = function(e){
            $(this).unbind('click');
            
            if(typeof $(this).data('state') == 'undefined'){ $(this).data('state', 'Closed'); }
            
            if($(this).data('state') == 'Closed'){
                
                $(this).data('state', 'Open');
                
                var winwidth = $(window).width();
                var batwidth = $(f).width();
                var gutterwidth = (winwidth - batwidth) / 2;
                
                if(gutterwidth < 200){
                    var fullw = 240 - gutterwidth;
                    var one4th = Math.floor(fullw * 0.25);
                    var three4th = one4th * 3; 
                    $('body').css({"overflow-x": "hidden"});
                    $(g).animate({"left": "+="+three4th, "width": "+="+one4th }, "slow", function(){
                        // debug.log('categoryToggleOn animate closure 1');
                    });
                }
                
                $(this).css({"background-position": "-132px -133px"});
                $("+ dd", this).animate({"left": "+=210"}, "slow", function(){
                    // debug.log('categoryToggleOn animate closure 2');
                    // debug.log($(this));
                    // rebind                   
                    $(this).parent().find('dt').bind('click', clickHandler);
                });
                
            }
            else{
                // debug.log('toggle OFF');
                $(this).data('state', 'Closed');
                
                if(gutterwidth < 200){        
                    $(g).animate({"left": "-="+three4th, "width": "-="+one4th }, "slow", function(){
                        $(g).removeAttr("style");
                        $('body').css({"overflow-x": "auto"});
                        // debug.log('categoryToggleOff animate closure 1');
                    });
                }
                
                $(this).css({"background-position": "-72px -133px"});
                $("+ dd", this).animate({"left": "-=210"}, "slow", function(){
                    // debug.log('categoryToggleOff animate closure 2');
                    // rebind
                    $(this).parent().find('dt').bind('click', clickHandler);
                });
            }
            
        };
        
        return this.bind('click', clickHandler);
        
    };
  
})(jQuery);