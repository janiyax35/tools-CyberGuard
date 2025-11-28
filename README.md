<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:1e293b&height=220&section=header&text=CYBERGUARD&fontSize=80&fontColor=3b82f6&animation=fadeIn&fontAlignY=35&desc=Advanced%20Password%20Security%20Suite&descAlignY=65&descSize=20&descColor=f8fafc" width="100%"/>
  
  <a href="https://github.com/janiyax35/CyberGuard">
    <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&duration=2000&pause=1000&color=3B82F6&center=true&vCenter=true&multiline=true&width=600&height=100&lines=%5B+SYSTEM+INITIALIZED+%5D;%5B+LOADING+MODULES...+%5D;%5B+ANALYZER+%3A+ONLINE+%5D;%5B+GENERATOR+%3A+ONLINE+%5D" alt="Terminal UI" />
  </a>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Security-A%2B%2B-10b981?style=for-the-badge&logo=shield&logoColor=white" alt="Security Rating">
  <img src="https://img.shields.io/badge/Tech_Stack-Flask_%7C_Tailwind-3b82f6?style=for-the-badge&logo=python&logoColor=white" alt="Tech Stack">
  <a href="https://haveibeenpwned.com/API/v3"><img src="https://img.shields.io/badge/API-HaveIBeenPwned-ef4444?style=for-the-badge&logo=fire&logoColor=white" alt="API Integration"></a>
  <img src="https://img.shields.io/badge/Encryption-Standard_Library-f59e0b?style=for-the-badge&logo=lock&logoColor=white" alt="Encryption">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212748842-9fcbad5b-6173-4175-8a61-521f3dbb7514.gif" width="100%" height="3px" alt="Matrix Line"/>
</p>

## 🛡️ Mission Protocol
**CyberGuard** is a comprehensive security suite designed to harden digital defenses. It moves beyond simple length checks, utilizing cryptographic entropy calculations and real-time data breach cross-referencing to ensure password integrity.

> *"Security is not a product, but a process."*

---

## ⚡ Core Modules

### 1. 🧬 Entropy Analyzer
A deep-dive analysis tool that deconstructs passwords to evaluate their true resistance against brute-force attacks.
* **Real-time Breach Detection:** Integrates with the **HaveIBeenPwned API** via *K-Anonymity* (only the first 5 chars of the SHA-1 hash are sent) to check if a password has been exposed in known data leaks.
* **Entropy Calculation:** Measures the information density (bits) of your password.
* **Crack Time Estimation:** Uses `zxcvbn` logic to estimate offline attack resistance.

### 2. 🔐 Cryptographic Generator
Generates high-strength credentials designed to break standard dictionary attacks.
* **Ambiguity Exclusion:** Automatically removes confusing characters (e.g., `0` vs `O`, `1` vs `l`, `I`).
* **Customizable Complexity:** Fine-tune length, character sets (Upper, Lower, Digits, Symbols).
* **Secure Randomness:** Built on Python's `secrets` module for cryptographically strong random number generation.

---

## 🛠️ Installation & Deployment

### Prerequisites
* Python 3.8+
* pip (Python Package Manager)

### Quick Start (Terminal)


#### 1. Clone the secure repository
```bash
git clone [https://github.com/janiyax35/CyberGuard.git](https://github.com/janiyax35/CyberGuard.git)
```
#### 2. Enter the system directory
```bash
cd CyberGuard
```
#### 3. Install dependencies
```bash
pip install flask zxcvbn requests
```
#### 4. Initiate the mainframe
```bash
python app.py
```
The system will go live at ```http://127.0.0.1:5000 ```

---

## 📂 System Architecture
```
graph TD;
    User[👤 User Interface] -->|Input Password| Frontend[💻 JS/Tailwind];
    Frontend -->|POST /analyze| Backend[🐍 Flask Server];
    Backend -->|Calculate| Zxcvbn[📊 Entropy Logic];
    Backend -->|SHA-1 Range| API[☁️ HaveIBeenPwned];
    API -->|Hash Suffix Matches| Backend;
    Backend -->|JSON Data| Frontend;
    Frontend -->|Display| User;
```

## 🕵️‍♂️ Technical Specifications

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Flask (Python) | Lightweight WSGI web application framework. |
| **Frontend** | TailwindCSS | Utility-first CSS framework for the Cyberpunk UI. |
| **Logic** | Python `secrets` | PEP 506 compliant secure random number generation. |
| **API** | HIBP (Pwned Passwords) | Checks 600M+ exposed passwords securely. |
| **Algorithm** | SHA-1 (K-Anonymity) | Ensures the full password hash never leaves the server. |

---

<!-- Developer -->
## 👨‍💻 Developer

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/janiyax35">
          <img src="https://avatars.githubusercontent.com/janiyax35" width="100px;" alt="Developer"/><br/>
          <sub><b>Janith Deshan</b></sub>
        </a><br/>
        <sub>BSc (Hons) Information Technology</sub><br/>
        <sub>Specialized in Cyber Security</sub>
      </td>
    </tr>
  </table>
</div>

<!-- Contact Information -->
## 📫 Contact

<div align="center">
  <a href="mailto:janithmihijaya123@gmail.com">
    <img src="https://img.shields.io/badge/Email-janithmihijaya123@gmail.com-02193d?style=for-the-badge&logo=gmail&logoColor=white&labelColor=red" alt="Email"/>
  </a>
  <br/>
  <a href="https://linkedin.com/in/janithdeshan">
    <img src="https://img.shields.io/badge/LinkedIn-janithdeshan-02193d?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0a66c2" alt="LinkedIn"/>
  </a>
  
  <a href="https://janiyax35.github.io">
    <img src="https://img.shields.io/badge/Portfolio-janiyax35.github.io-02193d?style=for-the-badge&logo=github&logoColor=white&labelColor=darkgreen" alt="Portfolio"/>
  </a>
</div>