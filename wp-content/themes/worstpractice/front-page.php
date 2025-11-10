<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
    <section class="c-content__list --home">
<?php while(have_posts()): ?>
    <?php the_post(); ?>
        <article class="l-article">
            <figure class="l-illustration">
                <a href="<?php the_permalink(); ?>"><img class="l-illustration__image" src="<?=sc('[assets-url]')?>/img/post-illustration-placeholder.png" <?php if(has_post_thumbnail()): ?>data-src="<?php get_the_post_thumbnail(); ?>"<?php endif; ?> alt="<?php the_title(); ?>"></a>
            </figure>
            <header class="l-header">
                <p class="l-header__author">by Gábor Iván</p>
                <p class="l-header__date">January&nbsp;31, 2023
                </p>
                <h3 class="l-header__title"><a href="<?php the_permalink(); ?>>"><?php the_title(); ?></a></h3>
            </header>
            <p class="l-excerpt">
                <?php the_excerpt(); ?>
            </p>
        </article>
<?php endwhile; ?>
    </section>
</main>
<?php get_footer(); ?>