<?php

$column_gap = $attributes[ 'columns_gap' ] ?? '';
$link_text = $attributes[ 'link_text' ] ?? __( 'Read More', 'create-guten-block' );

$template =
'<div class="cf-article-column ' . $attributes[ 'row_columns' ] . ' ' . $column_gap . '">
	<div class="cf-ab-featured-image">
		<a href="' . $article['guid']['rendered'] . '">
			<img src="' . $article['featured_image_url']['medium'] . '" alt="Lorem ipsum title" />
		</a>
	</div>
	<div class="cf-ab-title">
		<h3>' . $article['title']['rendered'] . '</h3>
	</div>
	<div class="cf-ab-excerpt">
		<p>' . $article['clean_excerpt'] . '</p>
	</div>
	<div class="cf-ab-link">
		<a href="' . $article['guid']['rendered'] . '">' . $link_text . '</a>
	</div>
</div>';

return $template;
