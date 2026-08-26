"""One-off script to generate small test fixture images (not run at build time).
Run with: python3 scripts/gen-fixtures.py
"""
import io
import os

import piexif
from PIL import Image

import pillow_heif

pillow_heif.register_heif_opener()

OUT = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")
os.makedirs(OUT, exist_ok=True)


def gradient_image(w=32, h=32, alpha=False):
    mode = "RGBA" if alpha else "RGB"
    img = Image.new(mode, (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            r = int(255 * x / (w - 1))
            g = int(255 * y / (h - 1))
            b = 128
            if alpha:
                a = int(255 * (1 - (x / (w - 1) + y / (h - 1)) / 2))
                px[x, y] = (r, g, b, a)
            else:
                px[x, y] = (r, g, b)
    return img


# Opaque RGB fixtures
rgb = gradient_image(alpha=False)
rgb.save(os.path.join(OUT, "sample.png"))
rgb.save(os.path.join(OUT, "sample.bmp"))
rgb.save(os.path.join(OUT, "sample.webp"), quality=90)
rgb.convert("P", palette=Image.ADAPTIVE).save(os.path.join(OUT, "sample.gif"))

# JPEG with real EXIF (GPS + orientation) for exif.ts tests
exif_dict = {
    "0th": {piexif.ImageIFD.Orientation: 6, piexif.ImageIFD.Make: b"TestCam"},
    "GPS": {
        piexif.GPSIFD.GPSLatitudeRef: b"N",
        piexif.GPSIFD.GPSLatitude: ((37, 1), (46, 1), (30, 1)),
        piexif.GPSIFD.GPSLongitudeRef: b"W",
        piexif.GPSIFD.GPSLongitude: ((122, 1), (25, 1), (9, 1)),
    },
}
exif_bytes = piexif.dump(exif_dict)
jpeg_path = os.path.join(OUT, "sample.jpg")
rgb.save(jpeg_path, exif=exif_bytes, quality=90)

# Plain JPEG with no EXIF at all
rgb.save(os.path.join(OUT, "sample-no-exif.jpg"), quality=90)

# Transparent PNG for transparency-flattening tests
rgba = gradient_image(alpha=True)
rgba.save(os.path.join(OUT, "sample-alpha.png"))

# Corrupt "jpeg" for error-handling tests: valid-looking header, truncated/garbage body
with open(os.path.join(OUT, "corrupt.jpg"), "wb") as f:
    f.write(bytes([0xFF, 0xD8, 0xFF, 0xE0]) + b"\x00\x10JFIF\x00" + b"\x00" * 4 + b"GARBAGE_NOT_A_REAL_JPEG_BODY")

# Tiny HEIC fixture, used both as a unit-test fixture and as the runtime
# native-HEIC-decode capability probe shipped in public/.
heic_path = os.path.join(OUT, "sample.heic")
rgb.save(heic_path, quality=80)

print("Fixtures written to", OUT)
for name in sorted(os.listdir(OUT)):
    print(" ", name, os.path.getsize(os.path.join(OUT, name)), "bytes")
