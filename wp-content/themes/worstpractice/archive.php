<?php get_header(); ?>
<?php get_sidebar(); ?>
<main>
<h2><?php the_archive_title(); ?></h2>
<?php

while (have_posts()) {
    the_post();  ?>
	<div>
		<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
	</div>
	<?php
}

?>
</main>

<?php get_footer(); ?>
