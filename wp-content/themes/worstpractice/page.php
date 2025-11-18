<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
<?php while(have_posts()): ?>
    <?php
    the_post();
    $lastUpdated = get_post_custom_values('last_update');
    ?>
    <section class="c-content__post">
            <article class="a-article">
                <header class="a-header">
                    <h2 class="a-header__title"><?php the_title(); ?></h2>
                    <?php if($lastUpdated): ?>
                    <h3 class="a-header__update"><?=end($lastUpdated)?></h3>
                    <?php endif; ?>
                </header>
                <div class="a-body">
                <?php the_content(); ?>
                </div>
            </article>
        </section>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>