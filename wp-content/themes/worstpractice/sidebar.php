<!-- sidebar -->
<aside class="m-menu">
    <div class="m-menu__burger">
        <span></span>
    </div>
    <input class="m-menu__toggle" type="checkbox" />
    <div class="m-menu__content">
        <nav>
            <h2 class="m-menu__title"><?=sc('[site-title]')?></h2>
            <?php wp_nav_menu(['theme_location' => 'home']); ?>
        </nav>
        <nav>
            <h2 class="m-menu__title">Categories</h2>
            <?php wp_nav_menu(['theme_location' => 'categories']); ?>
        </nav>
        <?php
        $tags = get_tags([
            'orderby' => 'count',
            'order'   => 'DESC',
            'number'  => 4,
        ]);
            $listCount = 0;
            ?>
        <?php if (is_iterable($tags)): ?>
            <nav>
                <h2 class="m-menu__title">Tags</h2>
                <ul class="m-menu__navigation">
                    <?php foreach ($tags as $tag): ?>
                        <?php
                                if (++$listCount === 4) {
                                    break;
                                }
                        $tag_link = get_tag_link($tag->term_id);
                        $is_current = false;
                        if (is_tag()) {
                            $queried = get_queried_object();
                            if (isset($queried->term_id) && $queried->term_id == $tag->term_id) {
                                $is_current = true;
                            }
                        } else {
                            $current_url = (is_ssl() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                            $current_url = untrailingslashit($current_url);
                            $tag_url = untrailingslashit($tag_link);
                            if ($current_url === $tag_url) {
                                $is_current = true;
                            }
                        }
                        ?>
                        <li class="menu-item<?php if ($is_current) {
                            echo ' current-menu-item';
                        } ?>">
                            <a class="m-menu__link" href="<?php echo esc_url($tag_link); ?>">
                                <?php echo esc_html($tag->name); ?> <sup><?php echo intval($tag->count); ?></sup>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <?php if (WP_DEBUG || count($tags) == 4): ?>
                <a class="m-menu__link -more" href="<?php echo esc_url(home_url('/tags/')); ?>">More</a>
                <?php endif; ?>
            </nav>
        <?php endif; ?>
        <?php
        $months = get_months([
            'order'  => 'DESC',
            'number' => 4,
        ]);
            ?>
        <?php if (!empty($months)): ?>
            <nav>
                <h2 class="m-menu__title">Archive</h2>
                <ul class="m-menu__navigation">
                    <?php foreach ($months as $month):
                        $link = get_month_link($month->y, $month->m);

                        $is_current = false;
                        if (is_month()) {
                            $queried_year  = get_query_var('year');
                            $queried_month = get_query_var('monthnum');
                            if (intval($queried_year) === intval($month->y) && intval($queried_month) === intval($month->m)) {
                                $is_current = true;
                            }
                        } else {
                            $current_url = (is_ssl() ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                            $current_url = untrailingslashit($current_url);
                            $month_url = untrailingslashit($link);
                            if ($current_url === $month_url) {
                                $is_current = true;
                            }
                        }
                        $label = sprintf('%04d-%02d', intval($month->y), intval($month->m));
                        ?>
                        <li class="menu-item<?php if ($is_current) {
                            echo ' current-menu-item';
                        } ?>">
                            <a class="m-menu__link" href="<?php echo esc_url($link); ?>">
                                <?php echo esc_html($label); ?> <sup><?php echo intval($month->count); ?></sup>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>

                <?php if (WP_DEBUG || count($months) === 4): ?>
                    <a class="m-menu__link -more" href="<?php echo esc_url(home_url('/archive/')); ?>">More</a>
                <?php endif; ?>
            </nav>
        <?php endif; ?>
        <nav>
            <?php wp_nav_menu([ 'theme_location' => 'pages' ]); ?>
        </nav>
    </div>
    <div class="m-menu__backdrop"></div>
</aside>
<!-- /sidebar -->
