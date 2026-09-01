import sys, os, base64

path = sys.argv[1]
b64 = sys.argv[2]
b64 += '=' * (-len(b64) % 4)
d = os.path.dirname(path)
if d:
    os.makedirs(d, exist_ok=True)
with open(path, 'wb') as f:
    f.write(base64.b64decode(b64))
print('Saved:', path)
