import sys, os, json, base64

def run():
    payload = sys.argv[1]
    data = json.loads(base64.b64decode(payload).decode('utf-8'))
    for path, content in data.items():
        d = os.path.dirname(path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content.strip() + '\n')
        print('Saved:', path)

if __name__ == '__main__':
    run()
