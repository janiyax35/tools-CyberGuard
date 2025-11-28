import hashlib
import secrets
import string
import requests
from flask import Flask, render_template, request, jsonify
from zxcvbn import zxcvbn

app = Flask(__name__)

# --- Helper Functions ---
def check_pwned_api(password):
    """
    Checks the password against HaveIBeenPwned API using K-Anonymity.
    Returns the number of times the password has been exposed.
    """
    sha1password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    first5_char = sha1password[:5]
    tail = sha1password[5:]

    url = 'https://api.pwnedpasswords.com/range/' + first5_char
    try:
        res = requests.get(url)
        if res.status_code != 200:
            return 0

        hashes = (line.split(':') for line in res.text.splitlines())
        for h, count in hashes:
            if h == tail:
                return int(count)
        return 0
    except Exception as e:
        print(f"Error checking pwned API: {e}")
        return 0

def generate_secure_password(length=12, use_upper=True, use_lower=True, use_numbers=True, use_symbols=True):

    lower = 'abcdefghijkmnopqrstuvwxyz'
    upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    digits = '23456789'
    symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?'

    char_pool = ''
    required_chars = []

    if use_lower:
        char_pool += lower
        required_chars.append(secrets.choice(lower))
    if use_upper:
        char_pool += upper
        required_chars.append(secrets.choice(upper))
    if use_numbers:
        char_pool += digits
        required_chars.append(secrets.choice(digits))
    if use_symbols:
        char_pool += symbols
        required_chars.append(secrets.choice(symbols))

    if not char_pool:
        return "Error: No character types selected"

    remaining_length = length - len(required_chars)
    if remaining_length < 0:
         pass

    password_chars = required_chars + [secrets.choice(char_pool) for _ in range(max(0, remaining_length))]

    # Shuffle to mix required chars
    import random
    rng = random.SystemRandom()
    rng.shuffle(password_chars)

    return ''.join(password_chars)

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    password = data.get('password', '')

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    # 1. zxcvbn score
    results = zxcvbn(password)
    score = results['score'] # 0-4
    crack_time = results['crack_times_display']['offline_slow_hashing_1e4_per_second']
    feedback = results['feedback']

    # 2. Custom Checks
    length_check = len(password) >= 8

    # 3. Breach Check
    breach_count = check_pwned_api(password)

    response = {
        'score': score,
        'entropy': results.get('guesses_log10', 0),
        'crack_time': crack_time,
        'suggestions': feedback.get('suggestions', []),
        'warning': feedback.get('warning', ''),
        'length_valid': length_check,
        'breach_count': breach_count
    }
    return jsonify(response)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    try:
        length = int(data.get('length', 12))
        use_upper = data.get('upper', True)
        use_lower = data.get('lower', True)
        use_numbers = data.get('numbers', True)
        use_symbols = data.get('symbols', True)

        if length < 4:
            length = 4
        if length > 128:
            length = 128

        password = generate_secure_password(length, use_upper, use_lower, use_numbers, use_symbols)
        return jsonify({'password': password})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
