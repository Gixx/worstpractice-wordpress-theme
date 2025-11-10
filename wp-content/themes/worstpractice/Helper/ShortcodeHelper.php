<?php

namespace Worstpractice\Helper;

class ShortcodeHelper
{
    private static ?self $instance = null;

    private function __construct(){}

    public static function doShortcode(string $shortcode): string
    {
        if (self::$instance === null) {
            self::$instance = new ShortcodeHelper();
        }
        return self::$instance->resolve($shortcode);
    }

    private function resolve(string $shortcode = ''): string {
        $shortcodeTag = $this->getShortcodeTag($shortcode);

        if (shortcode_exists($shortcodeTag)) {
            return do_shortcode($shortcode);
        }

        if (!extension_loaded('yaml') || !function_exists('yaml_parse_file')) {
            return '*** '.$shortcode.' (missing YAML extension) ***';
        }

        return $this->getConfigShortcode($shortcodeTag, $shortcode);
    }

    private function getShortcodeTag(string $input): string
    {
        $matches = [];
        preg_match('#^\[(?<shortcode>[^]\s]*)]#', $input, $matches);
        return $matches['shortcode'];
    }

    private function getConfigShortcode(string $shortcodeTag, string $input): string
    {
        $config = $this->getConfigShortcodes();

        if (array_key_exists($shortcodeTag, $config)) {
            // Ensure we return a string
            return (string) $config[$shortcodeTag];
        }

        return '*** '.$input.' (key not found in config.yml) ***';
    }

    /**
     * @return array<string, string>
     */
    private function getConfigShortcodes(): array
    {
        static $configShortcodes = null;

        if ($configShortcodes === null) {
            $config = yaml_parse_file(get_template_directory() . '/config.yml');
            // Convert to flat array
            $configShortcodes = $this->flattenArray($config);
        }

        return $configShortcodes;
    }

    /**
     * @return array<string, mixed>
     */
    private function flattenArray(array $input, string $prefix = '', string $sep = '-'): array {
        $result = [];
        foreach ($input as $key => $value) {
            // Exclude numeric indexes from the composed key. If the key is numeric and the
            // value is an array, recurse into it keeping the same prefix so children are
            // flattened under the parent key without the numeric segment.
            if (is_int($key) || (is_string($key) && is_numeric($key))) {
                if (is_array($value)) {
                    $result = array_merge($result, $this->flattenArray($value, $prefix, $sep));
                }
                // Skip adding an entry for numeric keys (including scalar values)
                continue;
            }

            $composedKey = $prefix === '' ? $key : $prefix . $sep . $key;
            if (is_array($value)) {
                $result = array_merge($result, $this->flattenArray($value, $composedKey, $sep));
            } else {
                $result[$composedKey] = $value;
            }
        }
        return $result;
    }
}