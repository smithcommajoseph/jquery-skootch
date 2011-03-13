/**
 * jQuery Skootch: desc goes here
 * http://
 * 
 * @param name
 * @param value
 */
 
(function($) {
    
var ver = '1.0';

$.fn.skootch = function(property, value) {

    var overrides = {};
    
    if(arguments.length > 0){
        //if we passed in an object of overrides
        if(arguments.length === 1 && typeof property == 'object') { overrides = property; }
        
        //if we are overriding a single value
        else if(arguments.length === 2 && value !== 'undefined'){
            for(var prop in $.fn.skootch.defaults){
                if(prop == property) overrides[property] = value;
                else {} //TODO: add  error handling
            }
        }
        
        // if we made it here, we have NEITHER a map of overrides 
        // NOR a key => value style pair of args to work with
        //TODO: add error handling
        else { return this; }
    }
    
    //merge the defaults w/ user overridden params
    var params = $.extend($.fn.skootch.defaults, overrides),
    
    //create our $trigger state tracking classes for styling
    triggerclosed = 'skootch-trigger-closed',
    triggeropen = 'skootch-trigger-open',
    
    //set our trigger jQ ob
    trigger = params.trigger,
    
    //
    invaderlinks = params.invaderlinks,
    
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
    },
    
    //advance
    advance = function(animatecallback){
        $(trigger).data('state', 'Open');
        
        // var winwidth = $(window).width();
        // var batwidth = $indigen.width();
        // var gutterwidth = (winwidth - batwidth) / 2;
        
        // if(gutterwidth < 200){
            // var fullw = invaderWidth - gutterwidth;
            //  var one4th = Math.floor(fullw * 0.25);
            //  var three4th = one4th * 3; 
            $('body').css({"overflow-x": "hidden"});
            $indigen.css('position', 'relative').animate(animap.a, params.advancespeed, params.advanceeasing, function(){
                // console.log(params.direction);
            });
        // } 
        
        $(trigger).removeClass(triggerclosed).addClass(triggeropen);
        $(params.invader).animate(animap.a, params.advancespeed, params.advanceeasing, animatecallback);
    },
    
    //retreat
    retreat = function(animatecallback){
        // debug.log('toggle OFF');
        $(trigger).data('state', 'Closed');
        
        // if(gutterwidth < 200){        
            $indigen.animate(animap.r, params.retreatspeed, params.retreateasing, function(){
                $('body').css({"overflow-x": "auto"});
            });
        // }
        
        $(trigger).removeClass(triggeropen).addClass(triggerclosed);
        $(params.invader).animate(animap.r, params.retreatspeed, params.retreateasing, animatecallback);
    },
    
    //currently unused,
    // something similar to ui.tabs destroy is probably more appropriate.
    tidy = function(){
        $indigen.removeAttr('style');
        $(params.invader).removeAttr('style');
    };
    
    // set animap = to our desired direction map
    switch(params.direction){
        case 'left':    animap = leftmap;   break;
        case 'right':   animap = rightmap;  break;
        case 'top':     animap = topmap;    break;
    }
    
    var clickHandler = function(e){
        var isinvader = false;
        
        //unbind
        $(trigger).unbind('.skootchEvents');
        
        //set the isinvader true if the e.target in the invaderlinks obj
        for(var i=0; i < $(params.invaderlinks).length; i++){
            if(e.target === $(params.invaderlinks)[i]) { isinvader = true; }
        }
        
        //if if the e.target in the params.invaderlinks obj and we are supposed to retreat on click
        //call retreat and act appropriately
        if(isinvader === true && params.invaderclickretreat === true) {
            retreat(function(){
                
                //fire our callback
                params.invaderclickcallback();
                
                //if we are clicking on something with an href set the window.location
                //otherwise, rebind our click
                //this is a temp hack as most of this should prob be set in our above callback
                if($(e.target).attr('href') !== '' || typeof $(e.target).attr('href') !== 'undefined' ){
                    window.location = $(e.target).attr('href');
                } else {
                    $(trigger).bind('click.skootchEvents.trigger', clickHandler);
                }
            });
        }
        
        //
        else {
            //initial pass
            if(typeof $(trigger).data('state') == 'undefined'){ 
                $(trigger).data({'state': 'Closed', 'direction': params.direction});
            }
            //if we are closed, advance
            if($(trigger).data('state') == 'Closed'){
                advance(function(){
                    // rebind
                    $(trigger).bind('click.skootchEvents.trigger', clickHandler);
                });
            }
            //if we are open, retreat
            else{
                retreat(function(){
                    // rebind
                    $(trigger).bind('click.skootchEvents.trigger', clickHandler);
                });
            }
        }
        
        return false;
    };
    
    return $(trigger+', '+params.invaderlinks).bind('click.skootchEvents.trigger', clickHandler);
    
};

$.fn.skootch.ver = function() { return ver; };

$.fn.skootch.defaults = {
    trigger: '#skootch-trigger', //the id or class name used for the element that will trigger our skootch
    invader: '#skootch-invader', //the id or class name used element that will skootch into the window
    invaderlinks: '#skootch-invader a', //if there are links in the invader elem these are them.
    invaderclickretreat: true, //should everything skootch back to it's start position if a invaderlink is clicked?
    invaderclickcallback: function(){}, //callback for the invaderlinks on click
    wrapperSuffix: 'skootch-wrap', //the div that will wrap our DOM node that will be skootched by our 'invader'
    direction: "left", //direction of the initial animations
    advancespeed: 'slow', //advance speed of animations
    retreatspeed: 'slow', //retreat speed of animations
    advanceeasing: 'swing', //advancing easing function
    retreateasing: 'swing', //retreating easing function
    smart: true // should we change the amount we are animation our skootched elems by window size?
};

})(jQuery);