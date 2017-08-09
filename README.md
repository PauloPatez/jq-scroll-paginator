# jq-scroll-paginator
jQuery Scroll Paginator - A very simple ajax infinite scroll jquery plugin

Sample usage with Wordpress:
```php
add_action('wp_ajax_retrieve_pending_posts', 'load_more_pending_posts');
function load_more_pending_posts(){
    $page = $_GET['page'];
    $posts_per_page = $_GET['items_per_page'];
    $args = array(
        'post_status' => 'pending',
    );
    $posts_array = new WP_Query($args);
    wp_reset_query();
    $markup = "";
    $i = 0;
    while ( $posts_array->have_posts() ) : $posts_array->the_post();
        if (ceil(($i+1)/$posts_per_page) == (int)$page){
            $markup .= "<p>" . the_title() . "</p>";
        }
        $i++;
    endwhile;
    if ($markup != ""){
        wp_send_json( array('success' => 'true', 'markup' => $markup,'state' => 'running') );
    }else{
        wp_send_json( array('success' => 'true', 'state' => 'finished'));
    }
}
```
Plugin usage:
```javascript
$('#pending_post_list').CaSP({
    'url': "<?php echo admin_url( 'admin-ajax.php' ); ?>",
    'action': 'retrieve_pending_posts',
    'items_per_page': 5,
    'container_element': $('#pending_post_container'),
    'scroll_offset': $('#scroll_loading').height() + 40,
    'loading_indicator': $('#scroll_loading'),
    'call_function': 'add_listeners'
});
```