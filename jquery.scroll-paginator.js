/*!
 * jQuery Scroll Paginator - A very simple ajax infinite scroll jquery plugin
 *
 * Licensed under The MIT License
 *
 * @author  : Paulo Patez [<paulo@paulopatez.com>]
 * @doc     : https://github.com/PauloPatez/jq-scroll-paginator
 * @version : 0.1.0
 *
 */

jQuery.fn.CaSP = function (settings) {
    var config = {
        'url': null,
        'action': null,
        'items_per_page': 5,
        'container_element': $(this),
        'scroll_box': $(this),
        'scroll_offset': 0,
        'loading_indicator': null,
        'call_function': null,
        'extra_attr': ''
    };
    var options = jQuery.extend(config, settings);
    this.each(function () {
        var $this = $(this);
        $this.attr('retrieving', 'false');
        $this.attr('finished', 'false');
        $this.attr('items_per_page', options.items_per_page);
        if (!$this.attr('CaSP-page')) {
            $this.attr('CaSP-page', 0);
            retrieve($this, options);
        }
        if(options.scroll_box[0] == $(window)[0]){
            options.scroll_box.scroll(function() {
                if($(window).scrollTop() + $(window).height() >= $(document).height() - options.scroll_offset) {
                    retrieve($this, options);
                }
            });
        } else {
            options.scroll_box.scroll(function() {
                scroll_box_check($this, options);
            });
        }
    });
}
function scroll_box_check(el, opt){
    if(opt.scroll_box.scrollTop() + opt.scroll_box.innerHeight() >= opt.scroll_box[0].scrollHeight - opt.scroll_offset){
        retrieve(el, opt);
    }
}
function retrieve(el, opt){
    console.log(opt);
    if (el.attr('retrieving') == 'false' && el.attr('finished') == 'false'){
        el.attr('retrieving', 'true');
        $.ajax({
            type: "GET",
            url: opt.url,
            data: {
                'action' : opt.action,
                'items_per_page' : el.attr('items_per_page'),
                'page' : parseInt(el.attr('CaSP-page')) + 1
            },
            dataType: "json",
            success: function (response) {
                opt.container_element.append(response.markup);
                el.attr('retrieving', 'false');
                if (opt.call_function){
                    window[opt.call_function]();
                }
                if(response.state == "running"){
                    el.attr('CaSP-page', parseInt(el.attr('CaSP-page')) + 1);
                }
                if (response.state && response.state == "finished"){
                    el.attr('finished', 'true');
                    if (opt.loading_indicator != null){
                        opt.loading_indicator.remove();
                    }
                }else{
                    scroll_box_check(el, opt);
                }
            },
            error: function () {
                el.attr('retrieving', 'false');
            }
        });
    }
}