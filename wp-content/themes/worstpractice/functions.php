<?php

function activateFeatures(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
}

function enqueueAssets(): void {
    // https://github.com/WordPress/gutenberg/issues/36834
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );

    // https://stackoverflow.com/a/74341697/278272
    wp_dequeue_style( 'classic-theme-styles' );

	wp_enqueue_style(
		handle: 'bundle-style',
		src: get_stylesheet_directory_uri().'/assets/css/bundle.css',
		ver:wp_get_theme()->get( 'Version' )
	);

    wp_enqueue_script(
        handle: 'bundle-script',
        src: get_stylesheet_directory_uri().'/assets/js/bundle.js',
        ver: wp_get_theme()->get( 'Version' ),
        args: [ 'in_footer' => true ]
    );
}

// Cleanup global styles added by WordPress core.
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );

add_action( 'wp_enqueue_scripts', 'enqueueAssets' );
add_action( 'after_setup_theme', 'activateFeatures' );
