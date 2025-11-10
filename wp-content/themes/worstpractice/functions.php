<?php

require_once(__DIR__ . '/Helper/ShortcodeHelper.php');
use Worstpractice\Helper\ShortcodeHelper;

add_theme_support('post-thumbnails');

// Short-calling for do_shortcode :)
function sc(string $shortcode = ''): string {
    return ShortcodeHelper::doShortcode($shortcode);
}

add_shortcode('copy-year', function(): string {
    return date('Y');
});

add_shortcode('page-title', function(): string {
    $title = is_single()
        ? get_the_title()
        : strip_tags(get_the_archive_title());

    return ($title === 'Archives' ? 'Home' : $title) . ' - ' . sc('[site-title]');
});

add_shortcode('page-url', function(): string {
    global $wp;
    return home_url( $wp->request );
});

add_shortcode('assets-url', function(): string {
    return get_stylesheet_directory_uri().'/assets';
});

add_shortcode('wordpress-version', function(): string {
    return get_bloginfo('version');
});