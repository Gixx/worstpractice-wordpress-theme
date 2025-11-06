<?php get_header(); ?>
<p>this is a page, not a post</p>
<?php

while ( have_posts() ) {
	the_post();  ?>
	<div>
		<h2><?php the_title(); ?></h2>
		<div><?php the_content(); ?></div>
	</div>
	<?php
}

?>

<?php get_footer(); ?>