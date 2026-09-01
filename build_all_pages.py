import os

def w(p, c):
    d = os.path.dirname(p)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c.strip() + '\n')
    print('Wrote:', p)

print('build_all_pages.py ready')
