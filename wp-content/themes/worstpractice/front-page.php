<?php get_header(); ?>

<?php

while ( have_posts() ) {
	the_post();  ?>
	<div>
		<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	</div>
	<?php
}

?>

<?php get_footer(); ?>