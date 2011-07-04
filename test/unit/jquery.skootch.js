(function($){
    //some vars
    var hund = '100px',
        skootchLeftSetup = function(){
            //set up a basic skootch
            $('body').append('<div id="side"><div id="skootch-trigger"><a href="javascript:void(0)">trigger</a></div><ul id="skootch-invader"><li>invader</li></ul></div>');
            $('#side').css({'position': 'absolute', 'left': '0px', 'top': hund});
            $('#skootch-invader').css({'width': hund, 'position': 'absolute', 'left': '-'+hund, 'list-style-type': 'none', 'padding': '0px'});
            $('#skootch-trigger').css({'width': hund, 'display': 'none'})
                                 .skootch({
                                            indigen: '#wrap',
                                            smart: false
                                         });
        },
        skootchLeftTeardown = function(){
            $('#skootch-trigger').skootch('destroy');
            $('#side').remove();
        };
    
    $(document).ready(function(){
        module("Defaults");

        test("Defaults ob and props", function(){

            expect(19);

            //does the defaults object exist
            equals(typeof $.fn.skootch.defaults, 'object', '$.fn.skootch.defaults should be an object');

            //how many defaults are there?
            var expected = 17,
                actual = 0,
                prop;

            for(prop in $.fn.skootch.defaults){
                if($.fn.skootch.defaults.hasOwnProperty(prop)) { actual++; }
            }

            equals(expected, actual, 'There should be '+expected+' defaults');

            //are the defaults what we think they should be?
            equals(typeof $.fn.skootch.defaults.advanceEasing, 'string', '$.fn.skootch.defaults.advanceEasing should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.advanceSpeed, 'number', '$.fn.skootch.defaults.advanceSpeed should exist and be typeof = "number"');
            equals(typeof $.fn.skootch.defaults.indigen, 'string', '$.fn.skootch.defaults.indigen should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.indigenUseMargins, 'boolean', '$.fn.skootch.defaults.indigenUseMargins should exist and be typeof "boolean"');
            equals(typeof $.fn.skootch.defaults.invader, 'string', '$.fn.skootch.defaults.invader should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.invaderClickCallback, 'object', '$.fn.skootch.defaults.invaderClickCallback should exist and be typeof "object"');
            equals(typeof $.fn.skootch.defaults.invaderClickRetreat, 'boolean', '$.fn.skootch.defaults.invaderClickRetreat should exist and be typeof "boolean"');
            equals(typeof $.fn.skootch.defaults.invaderLinks, 'string', '$.fn.skootch.defaults.invaderLinks should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.justify, 'string', '$.fn.skootch.defaults.justify should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.minInvaderMargin, 'number', '$.fn.skootch.defaults.minInvaderMargin should exist and be typeof "number"');
            equals(typeof $.fn.skootch.defaults.retreatEasing, 'string', '$.fn.skootch.defaults.retreatEasing should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.retreatSpeed, 'number', '$.fn.skootch.defaults.retreatSpeed should exist and be typeof "number"');
            equals(typeof $.fn.skootch.defaults.smart, 'boolean', '$.fn.skootch.defaults.smart should exist and be typeof "boolean"');
            equals(typeof $.fn.skootch.defaults.squashOverflow, 'boolean', '$.fn.skootch.defaults.squashOverflow should exist and be typeof "boolean"');

            equals(typeof $.fn.skootch.defaults.triggerClosed, 'string', '$.fn.skootch.defaults.triggerClosed should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.triggerOpen, 'string', '$.fn.skootch.defaults.triggerOpen should exist and be typeof "string"');
            equals(typeof $.fn.skootch.defaults.wrapperSuffix, 'string', '$.fn.skootch.defaults.wrapperSuffix should exist and be typeof "string"');

        });

        module("Skootch Left", {setup: skootchLeftSetup, teardown: skootchLeftTeardown});
        
        test("Setup", function(){

            expect(3);

            equals(typeof $('#wrap-skootch-wrap'), 'object', 'Indigen container should be wrapped');
            equals($('#wrap').css('position'), 'static', 'Indigen container should have a position of "static"');
            equals($('#wrap').css('left'), 'auto', 'Indigen container should have a left position of "auto"');

        });
        
        test("Advance", function(){

            expect(3);

            stop();

            //advance and check positions
            $('#skootch-trigger').skootch('advance', function(){
                var wrapPosType, wrapLeftPos, skootchInvaderPos;
                //using setTimeout, because the animation callback that we pass to advance() 
                //fires post #skootch-invader animation NOT post the #indigen animation.
                setTimeout(function(){
                    wrapPosType = $('#wrap').css('position');
                    wrapLeftPos = $('#wrap').css('left');
                    skootchInvaderPos = $('#skootch-invader').css('left');
                    
                    $('#skootch-trigger').skootch('retreat', function(){
                        equals(wrapPosType, 'relative', 'Indigen container should have a position of "relative" post advance');
                        equals(wrapLeftPos, hund, 'Indigen container should be left by '+hund+' post advance');
                        equals(skootchInvaderPos, '0px', 'Skootch invader should be left by 0px post advance');

                        start();
                    });
                    
                }, $.fn.skootch.defaults.advanceSpeed);
            });
            
        });
        
        test("Retreat", function(){

            expect(3);

            stop();

            $('#skootch-trigger').skootch('advance', function(){
                
                //retreat and check positions
                $('#skootch-trigger').skootch('retreat', function(){
                    
                    //using setTimeout, because the animation callback that we pass to retreat() 
                    //fires post #skootch-invader animation NOT post the #indigen animation.
                    setTimeout(function(){
                        equals($('#wrap').css('position'), 'static', 'Indigen container should have a position of "static" post retreat');
                        equals($('#wrap').css('left'), 'auto', 'Indigen wrap should be left by "auto" post retreat');
                        equals($('#skootch-invader').css('left'), '-'+hund, 'Skootch invader should be left by -'+hund+' post retreat');
                        
                        start();
                        
                    }, $.fn.skootch.defaults.retreatSpeed);
                });
            });
            
        });
        
        test("Destroy", function(){
        
            expect(2);
        
            stop();
        
            $('#skootch-trigger').skootch('destroy', function(){
                strictEqual($('#wrap-skootch-wrap').length, 0, 'Indigen container wrap length should be 0 post destroy');
                strictEqual($('#wrap').attr('style'), undefined, 'Indigen container should have no inline styles post destroy');
                start();
            });
        });

    });
})(jQuery);
