import sys, os, base64, json

def unpack(b64_json):
    files = json.loads(base64.b64decode(b64_json).decode('utf-8'))
    for rel_path, content in files.items():
        os.makedirs(os.path.dirname(rel_path), exist_ok=True)
        with open(rel_path, 'w', encoding='utf-8') as f:
            f.write(content.strip() + '\n')
        print('Wrote:', rel_path)

if __name__ == '__main__':
    unpack(sys.argv[1])
