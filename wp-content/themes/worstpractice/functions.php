<?php

require_once(__DIR__ . '/Helper/ShortcodeHelper.php');
use Worstpractice\Helper\ShortcodeHelper;

add_theme_support('post-thumbnails');
add_theme_support('menus');

// Short-calling for do_shortcode :)
function sc(string $shortcode = ''): string
{
    return ShortcodeHelper::doShortcode($shortcode);
}

/**
 * @param array<string, string|int> $options
 * @return stdClass[]
 */
function get_months(array $options): array
{
    global $wpdb;

    $order = $options['order'] ?? 'DESC';
    $number = (int) ($options['number'] ?? 50);

    return $wpdb->get_results("
        SELECT YEAR(post_date) AS y, MONTH(post_date) AS m, COUNT(ID) AS count
        FROM {$wpdb->posts}
        WHERE post_type = 'post' AND post_status = 'publish'
        GROUP BY y, m
        ORDER BY y {$order}, m {$order}
        LIMIT {$number}
    ");
}

add_shortcode('copy-year', function (): string {
    return date('Y');
});

add_shortcode('page-title', function (): string {
    $title = is_single()
        ? get_the_title()
        : strip_tags(get_the_archive_title());

    return ($title === 'Archives' ? 'Home' : $title) . ' - ' . sc('[site-title]');
});

add_shortcode('page-url', function (): string {
    global $wp;
    return home_url($wp->request);
});

add_shortcode('assets-url', function (): string {
    return get_stylesheet_directory_uri().'/assets';
});

add_shortcode('wordpress-version', function (): string {
    return get_bloginfo('version');
});

add_action('init', function () {
    register_nav_menus(
        [
            'home' => __('Home'),
            'categories' => __('Categories'),
            'tags' => __('Tags'),
            'pages' => __('Pages')
        ]
    );

    // Page for unsupported browsers
    add_rewrite_rule(
        '^sorry/?$',
        'index.php?custom_template=sorry',
        'top'
    );

    // Page for all tags
    add_rewrite_rule(
        '^tags/?$',
        'index.php?custom_template=tag',
        'top'
    );

    // Page for all archives dates
    add_rewrite_rule(
        '^archive/?$',
        'index.php?custom_template=archive',
        'top'
    );
});

// Flush rewrite rules on theme switch to register custom rewrite rules
add_action('switch_theme', function () {
    flush_rewrite_rules();
});

add_filter('query_vars', function ($vars) {
    $vars[] = 'custom_template';
    return $vars;
});

add_filter('template_include', function ($template) {
    $custom_template = get_query_var('custom_template');

    if ($custom_template === 'sorry') {
        return locate_template('sorry.php');
    }

    if ($custom_template === 'tag') {
        return locate_template('all-tags.php');
    }

    if ($custom_template === 'archive') {
        return locate_template('all-archives.php');
    }


    return $template;
});
