from PIL import Image

img = Image.open(r'C:\Users\Raju\.gemini\antigravity\brain\20845224-7465-4d56-9c11-406ea7005c30\.user_uploaded\media_1794739385653_82f6a3c3.jpg')
w, h = img.size
print('Size:', w, h)

# Sample background spots
spots = [
    ('Top-Left (10, 10)', 10, 10),
    ('Top-Center (w/2, 20)', w//2, 20),
    ('Header-Right (w-30, 20)', w-30, 20),
    ('Above-cards (w//2, 80)', w//2, 80),
    ('Left-of-cards (10, 250)', 10, 250),
    ('Right-of-cards (w-10, 250)', w-10, 250),
    ('Between-cards (w//2, 350)', w//2, 350),
    ('Bottom-Left (10, h-80)', 10, h-80),
    ('Bottom-Right (w-10, h-80)', w-10, h-80),
]

for name, x, y in spots:
    rgb = img.getpixel((x, y))
    hex_col = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
    print(f'{name}: RGB={rgb} HEX={hex_col}')
