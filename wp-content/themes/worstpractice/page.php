<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
<?php while(have_posts()): ?>
    <?php the_post(); ?>
    <section class="c-content__post">
            <article class="a-article">
                <header class="a-header">
                    <h2 class="a-header__title"><?php the_title(); ?></h2>
                </header>
            <div class="a-body">
                <?php the_content(); ?>
            </article>
        </section>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>