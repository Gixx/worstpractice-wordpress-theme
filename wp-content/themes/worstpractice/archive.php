<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
    <header class="c-header">
        <h2 class="c-header__title"><?php the_archive_title(); ?></h2>
    </header>
    <section class="c-content__list">
        <?php $i = 0; ?>
        <?php while (have_posts()): ?>
            <?php the_post(); $i++; ?>
            <article class="l-article">
                <figure class="l-illustration">
                    <?php if (has_post_thumbnail()) {
                        $thumbnail_id = get_post_thumbnail_id(intval(get_the_ID()));
                        $url = wp_get_attachment_url(intval($thumbnail_id));
                    } else {
                        $url = '';
                    } ?>
                    <a href="<?php the_permalink(); ?>"><img class="l-illustration__image" src="<?=sc('[assets-url]')?>/img/post-illustration-placeholder.png" data-src="<?=$url;?>" alt="<?php the_title(); ?>"></a>
                </figure>
                <header class="l-header">
                    <p class="l-header__author">by <?=get_the_author_meta('display_name', get_the_author_meta('ID'));?></p>
                    <p class="l-header__date"><?=get_the_date('F d, Y')?></p>
                    <h3 class="l-header__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                </header>
                <p class="l-excerpt"><?=get_the_excerpt()?></p>
            </article>
        <?php endwhile ?>
        <?php
        $remainder = $i % 3;
        $needed = ($remainder === 0) ? 0 : 3 - $remainder;
        ?>
        <?php for ($j = 0; $j < $needed; $j++): ?>
        <article class="l-article --empty"></article>
        <?php endfor; ?>
    </section>
</main>
<?php get_footer(); ?>
