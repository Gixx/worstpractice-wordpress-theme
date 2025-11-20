<?php get_header(); ?>
<?php get_sidebar(); ?>
<main class="c-content">
    <section class="c-content__dates">
        <article class="a-article">
            <header class="a-header">
                <h2 class="a-header__title">Archive collection</h2>
            </header>
            <div class="a-columns">
<?php
// Fetch all year-month combinations that have published posts (no limit)
global $wpdb;
$results = $wpdb->get_results("
    SELECT 
        YEAR(post_date) AS y, 
        MONTH(post_date) AS m, 
        COUNT(ID) AS count
    FROM {$wpdb->posts}
    WHERE 
        post_type = 'post' 
        AND post_status = 'publish'
    GROUP BY y, m
    ORDER BY y DESC, m DESC
    ");


if (!empty($results)) {
    $groups = [];
    foreach ($results as $row) {
        $y = intval($row->y);
        $m = intval($row->m);
        if (!isset($groups[$y])) {
            $groups[$y] = [];
        }
        $groups[$y][] = $row; // keep order as returned (months descending)
    }

    // Ensure years are in descending order
    krsort($groups, SORT_NUMERIC);

    foreach ($groups as $year => $months): ?>
                <nav>
                    <header>
                        <h3><?=intval($year)?></h3>
                    </header>
                    <ul>
                        <?php foreach ($months as $month):
                            $monthNum = intval($month->m);
                            $link = get_month_link(intval($month->y), $monthNum);
                            // Month full name (localized)
                            $label = date_i18n('F', mktime(0, 0, 0, $monthNum, 1, intval($month->y)));
                            ?>
                            <li><a rel="date" href="<?=esc_url($link)?>"><?=esc_html($label)?></a></li>
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