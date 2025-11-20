<?php get_header(); ?>
<?php get_sidebar(); ?>
    <main class="c-content">
        <section class="c-content__tags">
            <article class="a-article">
                <header class="a-header">
                    <h2 class="a-header__title">Tag collection</h2>
                </header>
                <div class="a-columns">
<?php
$tags = get_tags([
    'orderby'    => 'name',
    'order'      => 'ASC',
    'hide_empty' => true,
]);

if (is_iterable($tags)) {
    $groups = [];

    foreach ($tags as $tag) {
        $name = trim($tag->name);
        if ($name === '') {
            $first = '#';
        } else {
            $first = mb_substr($name, 0, 1);
            $first = mb_strtoupper($first);
            // Non-ASCII letters or non-letters fall back to '#'
            if (!preg_match('/[A-Z]/u', $first)) {
                $first = '#';
            }
        }

        if (!isset($groups[$first])) {
            $groups[$first] = [];
        }

        $groups[$first][] = $tag;
    }

    // Sort groups by key (A, B, C, ... #)
    ksort($groups, SORT_STRING);

    foreach ($groups as $letter => $groupTags): ?>
                    <nav>
                        <header>
                            <h3><?php echo esc_html($letter); ?></h3>
                        </header>
                        <ul>
                            <?php foreach ($groupTags as $tag): ?>
                                <li><a rel="tag" href="<?php echo esc_url(get_tag_link($tag->term_id)); ?>"><?php echo esc_html($tag->name); ?></a></li>
                            <?php endforeach; ?>
                        </ul>
                    </nav>
    <?php endforeach;
}
?>
                </div>
            </article>
        </section>
    </main>
<?php get_footer(); ?>