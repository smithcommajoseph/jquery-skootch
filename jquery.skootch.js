/**
 * jQuery Skootch: desc goes here
 * http://
 * 
 * @param p
 */
 
(function($) {
    $.fn.skootch = function(overrides) {
        
        //provides some sensible defaults
        var defaults = {
            trigger: '#skootch-trigger',
            invader: '#skootch-invader',
            wrapperSuffix: 'skootch-wrap',
            smart: true,
            direction: "left"
        },
        
        //merge the defaults w/ user overridden params
        params = $.extend(defaults, overrides),
        
        //set $indigen to 'this'
        $indigen = this,
        
        //the $indigen node wrapper id
        indigenewrap = $indigen.attr('id')+'-'+params.wrapperSuffix,
        
        //wrap $indigen and set '$indigenewrapper' to the res
        $indigenewrapper = $indigen.wrap(function() {
                                return '<div id="'+indigenewrap+'" syle="position: relative;"/>';
                            }),
        
        //caclulate the 'invading' nodes width.
        invaderWidth = $(params.invader).width(),
        
        //create animap as an empty ob literal
        animap = {},
        
        //create our direction maps
        leftmap = {
            a: {"left": "+="+invaderWidth},
            r: {"left": "-="+invaderWidth}
        },
        rightmap = {
            a: {"right": "+="+invaderWidth},
            r: {"right": "-="+invaderWidth}
        },
        topmap = {
            a: {"top": "+="+invaderWidth},
            r: {"top": "-="+invaderWidth}
        };
        
        switch(params.direction){
            case 'left':
                animap = leftmap;
                break;
            case 'right':
                animap = rightmap;
                break;
            case 'top':
                animap = topmap;
                break;
        }
        
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
                     
                    $indigen.css('position', 'relative').animate(animap.a, "slow", function(){
                        // console.log(params.direction);
                    });
                // } 
                
                $(this).removeClass('skootch-trigger-closed').addClass('skootch-trigger-active');
                $(params.invader).animate(animap.a, "slow", function(){
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
                    $indigen.animate(animap.r, "slow", function(){
                        $('body').css({"overflow-x": "auto"});
                    });
                // }
                
                $(this).removeClass('skootch-trigger-active').addClass('skootch-trigger-closed');
                $(params.invader).animate(animap.r, "slow", function(){
                    // debug.log('categoryToggleOff animate closure 2');
                    // rebind
                    $(params.trigger).bind('click.skootchEvents', clickHandler);
                });
            }
            
        };
        
        return $(params.trigger).bind('click.skootchEvents', clickHandler);
        
    };
  
})(jQuery);