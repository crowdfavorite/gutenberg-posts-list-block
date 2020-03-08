<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function testing_gutenberg_block_cgb_block_assets()
{ // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'testing_gutenberg_block-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array ( 'wp-editor' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
	
	// Register block editor script for backend.
	wp_register_script(
		'testing_gutenberg_block-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		// Block.build.js: We register the block here. Built with Webpack.
		array ( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null,
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);
	
	// Register block editor styles for backend.
	wp_register_style(
		'testing_gutenberg_block-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array ( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);
	
	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'testing_gutenberg_block-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);
	
	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cgb/block-testing-gutenberg-block', array (
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'           => 'testing_gutenberg_block-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script'   => 'testing_gutenberg_block-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'    => 'testing_gutenberg_block-cgb-block-editor-css',
			'render_callback' => 'render_posts_block'
		)
	);
}

function render_posts_block( $attributes )
{
	
	$data = '<div class="cf_articles_wrapper">
				<div class="cf-articles-block default-gap">';

	if ( ! empty( $attributes[ 'articles' ] ) ){
		foreach( $attributes[ 'articles' ] as $article ) {
			$data .= include( 'templates/default-box-template.php' );
		}
	}
	
	$data .= '</div></div>';
	
	return $data;
	
}

// Hook: Block assets.
add_action( 'init', 'testing_gutenberg_block_cgb_block_assets' );


// Add featured image directly to REST API.
add_action( 'rest_api_init', 'register_rest_images' );
function register_rest_images()
{
	register_rest_field( array ( 'post' ),
		'featured_image_url',
		array (
			'get_callback'    => 'get_rest_featured_image_thumbnail',
			'update_callback' => null,
			'schema'          => null,
		)
	);
}

function get_rest_featured_image_thumbnail( $object, $field_name, $request )
{
	if ( $object[ 'featured_media' ] ) {
		$images                = [];
		$images[ 'thumbnail' ] = wp_get_attachment_image_src( $object[ 'featured_media' ], 'thumbnail' )[ 0 ];
		$images[ 'medium' ]    = wp_get_attachment_image_src( $object[ 'featured_media' ], 'medium' )[ 0 ];
		$images[ 'large' ]     = wp_get_attachment_image_src( $object[ 'featured_media' ], 'large' )[ 0 ];
		
		return $images;
	}
	
	return false;
}

// Add cleaned excerpt to REST API.
add_action( 'rest_api_init', 'register_rest_excerpt' );
function register_rest_excerpt()
{
	register_rest_field( array ( 'post' ),
		'clean_excerpt',
		array (
			'get_callback'    => 'get_clean_excerpt',
			'update_callback' => null,
			'schema'          => null,
		)
	);
}

function get_clean_excerpt( $object, $field_name, $request )
{
	if ( $object[ 'excerpt' ][ 'rendered' ] ) {
		$excerpt = sanitize_text_field( $object[ 'excerpt' ][ 'rendered' ] );
		$excerpt = str_replace( '[&hellip;]', '', $excerpt );
		
		return $excerpt;
	}
	
	return false;
}
