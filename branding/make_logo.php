<?php
// White logo on a transparent background (PNG). Usage: php make_logo.php "BrandName" [out.png]
$name = $argv[1] ?? 'YourBrand';
$out  = $argv[2] ?? __DIR__ . '/logo-white.png';
$font = 'C:/Windows/Fonts/segoeuib.ttf';
$S = 4;                      // supersampling factor, scaled down at the end for smooth edges
$H = 190 * $S;               // final height 190 px (shown at ~200 px wide in the sidebar, so this is 2x retina)
$size = 64 * $S;
$box = imagettfbbox($size, 0, $font, $name);
$textW = $box[2] - $box[0];
$icon = 130 * $S; $gap = 28 * $S; $pad = 10 * $S;
$W = $pad * 2 + $icon + $gap + $textW;
$im = imagecreatetruecolor($W, $H);
imagealphablending($im, false); imagesavealpha($im, true);
imagefill($im, 0, 0, imagecolorallocatealpha($im, 255, 255, 255, 127));
imagealphablending($im, true);
$white = imagecolorallocate($im, 255, 255, 255);
$clear = imagecolorallocatealpha($im, 255, 255, 255, 127);
$x0 = $pad; $y0 = intdiv($H - $icon, 2); $r = 30 * $S;
function rrect($im, $x, $y, $w, $h, $r, $c) {
    imagefilledrectangle($im, $x + $r, $y, $x + $w - $r, $y + $h, $c);
    imagefilledrectangle($im, $x, $y + $r, $x + $w, $y + $h - $r, $c);
    foreach ([[$x + $r, $y + $r], [$x + $w - $r, $y + $r], [$x + $r, $y + $h - $r], [$x + $w - $r, $y + $h - $r]] as [$cx, $cy]) {
        imagefilledellipse($im, $cx, $cy, $r * 2, $r * 2, $c);
    }
}
// icon: white rounded square with three server bars and status dots cut out (transparent)
rrect($im, $x0, $y0, $icon, $icon, $r, $white);
imagealphablending($im, false);
$bw = 84 * $S; $bh = 22 * $S; $bx = $x0 + intdiv($icon - $bw, 2);
for ($i = 0; $i < 3; $i++) {
    $by = $y0 + 24 * $S + $i * 31 * $S;
    $save = $im;
    // bar outline: cut a rounded bar, then put a thinner white bar back leaving an outline look
    imagealphablending($im, false);
    rrect($im, $bx, $by, $bw, $bh, 8 * $S, $clear);
    rrect($im, $bx + 4 * $S, $by + 4 * $S, $bw - 8 * $S, $bh - 8 * $S, 5 * $S, imagecolorallocate($im, 255, 255, 255));
    imagefilledellipse($im, $bx + $bw - 16 * $S, $by + intdiv($bh, 2), 8 * $S, 8 * $S, $clear);
}
imagealphablending($im, true);
$ty = intdiv($H, 2) + (int) round($size * 0.36) - 4 * $S;
imagettftext($im, $size, 0, $x0 + $icon + $gap, (int) $ty, $white, $font, $name);
$w = intdiv($W, $S); $h = intdiv($H, $S);
$fin = imagecreatetruecolor($w, $h);
imagealphablending($fin, false); imagesavealpha($fin, true);
imagefill($fin, 0, 0, imagecolorallocatealpha($fin, 255, 255, 255, 127));
imagecopyresampled($fin, $im, 0, 0, 0, 0, $w, $h, $W, $H);
imagepng($fin, $out, 9);
echo "$out {$w}x{$h}\n";
