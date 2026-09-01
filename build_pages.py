import os

def w(path, code):
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as out:
        out.write(code.strip() + '\n')
    print('Generated:', path)
