/**
 * jQuery Skootch: desc goes here
 * http://
 * 
 * @param name
 * @param value
 */
 
(function($) {
    
var ver = '1.0';

$.fn.skootch = function(option, arg2) {
    var o = { s: this.selector, c: this.context };
    
    return this.each(function(){
        var params = setParams(this, option, arg2),

        //set our trigger jQ ob
        trigger = params.trigger,

        //
        invaderLinks = params.invaderLinks,

        //set $indigen to 'this'
        $indigen = $(o.s, o.c),

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
                $indigen.css('position', 'relative').animate(animap.a, params.advanceSpeed, params.advanceEasing, function(){
                    // console.log(params.direction);
                });
            // } 

            $(trigger).removeClass(params.triggerClosed).addClass(params.triggerOpen);
            $(params.invader).animate(animap.a, params.advanceSpeed, params.advanceEasing, animatecallback);
        },

        //retreat
        retreat = function(animatecallback){
            // debug.log('toggle OFF');
            $(trigger).data('state', 'Closed');

            // if(gutterwidth < 200){        
                $indigen.animate(animap.r, params.retreatSpeed, params.retreatEasing, function(){
                    $('body').css({"overflow-x": "auto"});
                });
            // }

            $(trigger).removeClass(params.triggerOpen).addClass(params.triggerClosed);
            $(params.invader).animate(animap.r, params.retreatSpeed, params.retreatEasing, animatecallback);
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
            $(trigger).unbind(params.triggerEvent);

            //set the isinvader true if the e.target in the invaderLinks obj
            for(var i=0; i < $(params.invaderLinks).length; i++){
                if(e.target === $(params.invaderLinks)[i]) { isinvader = true; }
            }

            //if if the e.target in the params.invaderLinks obj and we are supposed to retreat on click
            //call retreat and act appropriately
            if(isinvader === true && params.invaderClickRetreat === true) {
                retreat(function(){

                    //fire our callback
                    params.invaderClickCallback();

                    //if we are clicking on something with an href set the window.location
                    //otherwise, rebind our click
                    //this is a temp hack as most of this should prob be set in our above callback
                    if($(e.target).attr('href') !== '' || typeof $(e.target).attr('href') !== undefined ){
                        window.location = $(e.target).attr('href');
                    } else {
                        $(trigger).bind(params.triggerEvent, clickHandler);
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
                        $(trigger).bind(params.triggerEvent, clickHandler);
                    });
                }
                //if we are open, retreat
                else{
                    retreat(function(){
                        // rebind
                        $(trigger).bind(params.triggerEvent, clickHandler);
                    });
                }
            }

            return false;
        };

        return $(trigger+', '+params.invaderLinks).bind(params.triggerEvent, clickHandler);
        
    });
    
    
};

function setParams(node, options, arg2){
    var overrides = {},
        params = {};
    
    if(typeof options == 'object') { overrides = options; }
    
    if(typeof options == 'string') {
        switch(options){
            case 'destroy':
                params = $(node).data('skootch.params');
                if(!params) { return false; }
                $(node).removeData('skootch.params');
                destroy(params);
                return false;
            default:
                if(arg2 !== undefined){
                    for(var prop in $.fn.skootch.defaults){
                        if(prop == options) overrides[options] = arg2;
                    }
                }
        }
    }
    params = $.extend($.fn.skootch.defaults, overrides);
    $(node).data('skootch.params', params);
    
    return params;
}

function destroy(params){
    
}

$.fn.skootch.ver = function() { return ver; };

$.fn.skootch.defaults = {
    advanceEasing:      'swing', //advancing easing function
    advanceSpeed:       'slow', //advancing animation speed
    direction:          'left', //direction of the initial animations
    invader:            '#skootch-invader', //the id or class name used element that will skootch into the window
    invaderClickCallback: function(){}, //callback for the invaderLinks on click
    invaderClickRetreat: true, //should everything skootch back to it's start position if a invaderlink is clicked?
    invaderLinks:       '#skootch-invader a', //if there are links in the invader elem these are them.
    retreatEasing:      'swing', //retreating easing function
    retreatSpeed:       'slow', //retreating animation speed
    smart:              true, // should we change the amount we are animation our skootched elems by window size?
    trigger:            '#skootch-trigger', //the id or class name used for the element that will trigger our skootch
    triggerClosed:      'skootch-trigger-closed', //trigger closed status class
    triggerEvent:       'click.skootch', //name of Event that drives Skootch 
    triggerOpen:        'skootch-trigger-open', // trigger open status class
    wrapperSuffix:      'skootch-wrap' //the div that will wrap our DOM node that will be skootched by our 'invader'
};

})(jQuery);