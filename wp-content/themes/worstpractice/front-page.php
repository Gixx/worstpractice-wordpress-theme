<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
    <section class="c-content__list --home">
<?php while (have_posts()): ?>
    <?php the_post(); ?>
        <article class="l-article">
            <figure class="l-illustration">
            <?php if (has_post_thumbnail()) {
                $thumbnail_id = get_post_thumbnail_id(intval(get_the_ID()));
                wp_get_attachment_caption(intval($thumbnail_id));
                $url = wp_get_attachment_url(intval($thumbnail_id));
            } else {
                $url = '';
            } ?>

                <a href="<?php the_permalink(); ?>"><img class="l-illustration__image" src="<?=sc('[assets-url]')?>/img/post-illustration-placeholder.png" data-src="<?=$url;?>" alt="<?php the_title(); ?>"></a>
            </figure>
            <header class="l-header">
                <p class="l-header__author">by Gábor Iván</p>
                <p class="l-header__date">January&nbsp;31, 2023
                </p>
                <h3 class="l-header__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
            </header>
            <p class="l-excerpt">
                <?php the_excerpt(); ?>
            </p>
        </article>
<?php endwhile; ?>
    </section>
</main>
<?php get_footer(); ?>