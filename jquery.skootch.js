/**
 * jQuery Skootch: The JQuery Skootch plugin allows you to easily animate items into the viewport 
 * and will shift (skootch) the already visible DOM items appropiately.
 * http://
 * 
 * @param option
 * @param arg2
 */
 
(function($) {
    
var ver = '1.0';

$.fn.skootch = function(option, arg2) {
    var o = { s: this.selector, c: this.context };
    
    return this.each(function(){
        var $indigen = $(o.s, o.c),
        params = setParams(this, option, arg2);

        if(params !== false) {
            //the $indigen node wrapper id
            var indigenewrap = $indigen.attr('id')+'-'+params.wrapperSuffix,
            
            //wrap $indigen and set '$indigenewrapper' to the res
            $indigenewrapper = $indigen.wrap(function() {
                return '<div id="'+indigenewrap+'" syle="position: relative;"/>';
            });
            
            
            var clickHandler = function(e){
                var isinvader = false;

                //unbind
                $(params.trigger).unbind(params.triggerEvent);

                //set the isinvader true if the e.target in the invaderLinks obj
                for(var i=0; i < $(params.invaderLinks).length; i++){
                    if(e.target === $(params.invaderLinks)[i]) { isinvader = true; }
                }
                
                //call retreat and act appropriately
                if(isinvader === true && params.invaderClickRetreat === true) {
                    retreat($indigen, params, function(){
                        //fire our callback
                        if(params.invaderClickCallback !== null){ params.invaderClickCallback(e); }
                        else {
                            //if we are clicking on something with an href set the window.location
                            //otherwise, rebind our click
                            if($(e.target).attr('href') !== '' || typeof $(e.target).attr('href') !== undefined ){
                                      window.location = $(e.target).attr('href');
                                  } else {
                                      $(params.trigger).bind(params.triggerEvent, clickHandler);
                              }
                        }
                    });
                }

                //
                else {
                    //initial pass
                    if(typeof $(params.trigger).data('state') == 'undefined'){ 
                        $(params.trigger).data({'state': 'Closed', 'direction': params.direction});
                    }
                    //if we are closed, advance
                    if($(params.trigger).data('state') == 'Closed'){
                        advance($indigen, params, function(){
                            // rebind
                            $(params.trigger).bind(params.triggerEvent, clickHandler);
                        });
                    }
                    //if we are open, retreat
                    else{
                        retreat($indigen, params, function(){
                            // rebind
                            $(params.trigger).bind(params.triggerEvent, clickHandler);
                        });
                    }
                }

                return false;
            };

            return $(params.trigger+', '+params.invaderLinks).bind(params.triggerEvent, clickHandler);
            
        }
        
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
                destroy(node, params);
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

function setDirectionMaps(params){
    //caclulate the 'invading' nodes width.
    var invaderWidth = $(params.invader).width(),
    
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

    // set animap = to our desired direction map
    switch(params.direction){
        case 'left':    
            return leftmap;
        case 'right':
            return rightmap;
        case 'top':
            return topmap;
    }
}

function destroy(node, params){
    $(params.trigger).unbind(params.triggerEvent);
    $(node).unwrap();
    $(params.invader).removeAttr('style');
}

function advance($indigen, params, animatecallback){
    var animap = setDirectionMaps(params);
    $(params.trigger).data('state', 'Open');

    $('body').css({"overflow-x": "hidden"});
    $indigen.css('position', 'relative').animate(animap.a, params.advanceSpeed, params.advanceEasing);

    $(params.trigger).removeClass(params.triggerClosed).addClass(params.triggerOpen);
    $(params.invader).animate(animap.a, params.advanceSpeed, params.advanceEasing, animatecallback);
}

function retreat($indigen, params, animatecallback){
    var animap = setDirectionMaps(params);
    $(params.trigger).data('state', 'Closed');

    $indigen.animate(animap.r, params.retreatSpeed, params.retreatEasing, function(){
        $('body').css({"overflow-x": "auto"});
    });

    $(params.trigger).removeClass(params.triggerOpen).addClass(params.triggerClosed);
    $(params.invader).animate(animap.r, params.retreatSpeed, params.retreatEasing, animatecallback);
}

$.fn.skootch.ver = function() { return ver; };

$.fn.skootch.defaults = {
    advanceEasing:      'swing', //advancing easing function
    advanceSpeed:       'slow', //advancing animation speed
    direction:          'left', //direction of the initial animations
    invader:            '#skootch-invader', //the id or class name used element that will skootch into the window
    invaderClickCallback: null, //callback for the invaderLinks on click
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