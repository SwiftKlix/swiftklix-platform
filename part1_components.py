import os

def save(p, v):
    d = os.path.dirname(p)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(v.strip() + '\n')
    print('Saved:', p)
