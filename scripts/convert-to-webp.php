<?php
/**
 * Convert PNG/JPEG under assets/images to WebP (quality 82).
 * Run from project root: php scripts/convert-to-webp.php
 */
declare(strict_types=1);

if (!function_exists('imagewebp')) {
    fwrite(STDERR, "GD WebP support missing. Enable gd extension with WebP in php.ini.\n");
    exit(1);
}

$root = dirname(__DIR__) . '/assets/images';
$quality = 82;
$count = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS)
);

foreach ($iterator as $file) {
    if (!$file->isFile()) {
        continue;
    }
    $path = $file->getPathname();
    $ext = strtolower($file->getExtension());
    if (!in_array($ext, ['png', 'jpg', 'jpeg'], true)) {
        continue;
    }

    $out = preg_replace('/\.(png|jpe?g)$/i', '.webp', $path);
    if ($out === null || $out === $path) {
        continue;
    }

    if ($ext === 'png') {
        $im = @imagecreatefrompng($path);
        if (!$im) {
            fwrite(STDERR, "Skip (read fail): $path\n");
            continue;
        }
        if (!imageistruecolor($im)) {
            imagepalettetotruecolor($im);
        }
        imagealphablending($im, true);
        imagesavealpha($im, true);
    } else {
        $im = @imagecreatefromjpeg($path);
        if (!$im) {
            fwrite(STDERR, "Skip (read fail): $path\n");
            continue;
        }
    }

    if (!imagewebp($im, $out, $quality)) {
        imagedestroy($im);
        fwrite(STDERR, "Write fail: $out\n");
        continue;
    }
    imagedestroy($im);
    echo basename($path) . " -> " . basename($out) . "\n";
    $count++;
}

echo "Done. Converted $count file(s).\n";
