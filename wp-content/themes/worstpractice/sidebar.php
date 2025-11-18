<!-- sidebar -->
<aside class="m-menu">
    <div class="m-menu__burger">
        <span></span>
    </div>
    <input class="m-menu__toggle" type="checkbox" />
    <div class="m-menu__content">
        <nav>
            <h2 class="m-menu__title"><?=sc('[site-title]')?></h2>
            <?php wp_nav_menu( array( 'theme_location' => 'home' ) ); ?>
        </nav>
        <nav>
            <h2 class="m-menu__title">Categories</h2>
            <?php wp_nav_menu( array( 'theme_location' => 'categories' ) ); ?>
        </nav>
        <nav>
            <h2 class="m-menu__title">Tags</h2>
            <ul class="m-menu__navigation">
                <li><a class="m-menu__link" href="#">PHP <sup>11</sup></a></li>
                <li><a class="m-menu__link" href="#">Development <sup>8</sup></a></li>
                <li><a class="m-menu__link" href="#">Good <sup>5</sup></a></li>
            </ul>
            <a class="m-menu__link -more" href="#">More</a>
        </nav>
        <nav>
            <h2 class="m-menu__title">Archive</h2>
            <ul class="m-menu__navigation">
                <li><a class="m-menu__link" href="#">2025-11</a></li>
                <li><a class="m-menu__link" href="#">2025-10</a></li>
                <li><a class="m-menu__link" href="#">2025-09</a></li>
            </ul>
            <a class="m-menu__link -more" href="#">More</a>
        </nav>
        <nav>
            <?php wp_nav_menu( array( 'theme_location' => 'pages' ) ); ?>
        </nav>
    </div>
    <div class="m-menu__backdrop"></div>
</aside>
<!-- /sidebar -->
