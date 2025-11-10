<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
<?php while(have_posts()): ?>
	<?php the_post(); ?>
	<div>
		<h2><?php the_title(); ?></h2>
		<div><?php the_content(); ?></div>
	</div>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
