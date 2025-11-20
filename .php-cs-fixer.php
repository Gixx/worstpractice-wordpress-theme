<?php

$finder = PhpCsFixer\Finder::create()->in([
    __DIR__ . '/wp-content/themes/worstpractice'
]);

return (new PhpCsFixer\Config())
    ->setParallelConfig(PhpCsFixer\Runner\Parallel\ParallelConfigFactory::detect())
    ->setRules([
        '@PSR12' => true,
        'array_indentation' => true,
        'array_syntax' => ['syntax' => 'short'],
        'combine_consecutive_unsets' => true,
        'single_quote' => true
    ])
    ->setFinder($finder);