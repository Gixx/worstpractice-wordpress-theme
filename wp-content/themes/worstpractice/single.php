<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
<?php while(have_posts()): ?>
	<?php the_post(); ?>
    <section class="c-content__article">
        <article class="a-article">
            <header class="a-header">
                <h2 class="a-header__title"><?php the_title(); ?></h2>
                <div class="a-header__meta">
                    <p class="a-meta__date">Posted on <?php echo get_the_date(); ?></p>
                    <p class="a-meta__category">Posted under the <?php $category = get_the_category(); if (!empty($category)) { echo '<a href="' . esc_url(get_category_link($category[0]->term_id)) . '">' . esc_html($category[0]->name) . '</a>'; } ?> category</p><?php $tags = get_the_tags(); ?>
                    <?php if ($tags) : ?>
                    <p class="a-meta__tags">Posted with the following tags:
                        <?php foreach ($tags as $tag) : ?>
                        <a href="<?php echo get_tag_link($tag->term_id); ?>"><?php echo esc_html($tag->name); ?></a><?php echo ($tag !== end($tags)) ? ', ' : ''; ?>
                        <?php endforeach; ?>

                    </p>
                    <?php endif; ?>
                </div>
            </header>
            <p class="a-excerpt">
                <?=get_the_excerpt()?>
            </p>
            <?php if ( has_post_thumbnail() ): ?>
            <?php
            $thumbnail_id = get_post_thumbnail_id(get_the_ID());
            $caption      = wp_get_attachment_caption($thumbnail_id);
            $url          = wp_get_attachment_url($thumbnail_id);
            ?>
            <figure class="a-illustration">
                <img class="a-illustration__image" src="<?=sc('[assets-url]')?>/img/post-illustration-placeholder.png" data-src="<?=$url?>" alt="<?=sc('[page-title]')?>">
                <?php if ($caption) : ?>
                    <figcaption class="a-illustration__caption"><?=$caption?></figcaption>
                <?php endif; ?>
            </figure>
            <?php endif; ?>
            <div class="a-body">
                <?php the_content(); ?>
            </div>
            <div class="FeatureToggle" data-feature="comments" data-label="Engedélyezed a kommenteket?" data-value="on"></div>
            <div class="FeatureToggle" data-feature="cookies"></div>

            <footer class="a-footer">
                <h3 class="a-footer__title">About the author</h3>
                <a class="a-footer__avatar" href="#"><?php $user_id = get_the_author_meta('ID'); echo get_avatar($user_id, 120) ?></a>
                <p class="a-footer__author">
                    <?=sc('[author-introduction]')?>
                    <br>
                    <a href="">Read the full story</a>
                </p>
            </footer>
        </article>
    </section>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
