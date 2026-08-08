from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = {
    "nicole-portfolio-favicon-32.png": 32,
    "nicole-portfolio-icon-192.png": 192,
    "nicole-portfolio-apple-touch-icon.png": 180,
}

def scale_box(box, factor):
    return tuple(round(value * factor) for value in box)

def interpolate(first, second, amount):
    return tuple(round(a + (b - a) * amount) for a, b in zip(first, second))

def build_icon(size):
    factor = size * 4 / 96
    canvas_size = size * 4
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    pixels = image.load()
    for y in range(canvas_size):
        for x in range(canvas_size):
            amount = (x + y) / (2 * (canvas_size - 1))
            pixels[x, y] = (*interpolate((233, 248, 255), (234, 251, 245), amount), 255)

    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(scale_box((2, 2, 94, 94), factor), radius=round(24 * factor), fill=255)
    transparent = Image.new("RGBA", image.size, (0, 0, 0, 0))
    image = Image.composite(image, transparent, mask)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(scale_box((2, 2, 94, 94), factor), radius=round(24 * factor), outline="#b8dce8", width=max(1, round(2 * factor)))

    orbit = Image.new("RGBA", image.size, (0, 0, 0, 0))
    orbit_draw = ImageDraw.Draw(orbit)
    orbit_box = scale_box((13, 30, 83, 66), factor)
    orbit_width = max(1, round(4 * factor))
    orbit_draw.ellipse(orbit_box, outline="#22a5d5", width=orbit_width)
    orbit_draw.arc(orbit_box, start=190, end=350, fill="#31c8aa", width=orbit_width)
    orbit = orbit.rotate(24, center=(canvas_size // 2, canvas_size // 2), resample=Image.Resampling.BICUBIC)
    image.alpha_composite(orbit)
    draw = ImageDraw.Draw(image)
    draw.ellipse(scale_box((73, 26, 83, 36), factor), fill="#31c8aa")
    draw.polygon([scale_box(point, factor) for point in [(31, 28), (39, 28), (66, 58), (66, 68), (58, 68), (31, 38)]], fill="#123a4b")
    draw.rectangle(scale_box((31, 28, 39, 68), factor), fill="#123a4b")
    draw.rectangle(scale_box((58, 28, 66, 68), factor), fill="#123a4b")
    return image.resize((size, size), Image.Resampling.LANCZOS)

def main():
    public = ROOT / "public"
    public.mkdir(parents=True, exist_ok=True)
    for filename, size in OUTPUTS.items():
        build_icon(size).save(public / filename, format="PNG", optimize=True)

if __name__ == "__main__":
    main()
