<?php
/**
 * Plugin Name: CF Post List Gutenberg Block
 * Plugin URI: https://crowdfavorite.com
 * Description: This is a Gutenberg plugin created via create-guten-block.
 * Author: test
 * Author URI: https://crowdfavorite.com
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
