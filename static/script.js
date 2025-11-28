document.addEventListener('DOMContentLoaded', () => {

    // Logger
    const logContainer = document.getElementById('log-container');
    let logs = [];

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        logs = [{ timestamp, message, type }, ...logs].slice(0, 50);
        renderLogs();
    };

    const renderLogs = () => {
        logContainer.innerHTML = '';
        if (logs.length === 0) {
            logContainer.innerHTML = '<span class="text-gray-600 italic">System Ready...</span>';
            return;
        }
        logs.forEach(log => {
            const div = document.createElement('div');
            let colorClass = 'text-blue-300';
            if (log.type === 'error') colorClass = 'text-red-400';
            if (log.type === 'success') colorClass = 'text-green-400';

            div.className = `flex gap-2 ${colorClass}`;
            div.innerHTML = `<span class="opacity-50">[${log.timestamp}]</span><span>${log.message}</span>`;
            logContainer.appendChild(div);
        });
    };

    addLog('Security Suite Initialized.', 'success');

    // --- Tab Switching ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = {
        'ANALYZER': document.getElementById('analyzer-section'),
        'GENERATOR': document.getElementById('generator-section'),
        'ABOUT': document.getElementById('about-section')
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            // Update Buttons
            navBtns.forEach(b => {
                b.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-cyber-800';
            });
            btn.className = 'nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-cyber-800 text-cyber-accent border border-cyber-700 shadow-lg';

            // Show/Hide Sections
            Object.values(sections).forEach(el => {
                if(el) el.classList.add('hidden');
            });
            if(sections[mode]) {
                sections[mode].classList.remove('hidden');
                sections[mode].classList.add('animate-fade-in-up');
            }

            addLog(`Switched to ${mode} mode.`);
        });
    });

    // Analyzer Logic
    const passwordInput = document.getElementById('passwordInput');
    const toggleAnalyzerVisibility = document.getElementById('toggleAnalyzerVisibility');
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');
    const strengthScore = document.getElementById('strengthScore');
    const analysisResults = document.getElementById('analysisResults');

    // Check items
    const checkLength = document.getElementById('checkLength');
    const lengthValue = document.getElementById('lengthValue');
    const checkUppercase = document.getElementById('checkUppercase');
    const checkLowercase = document.getElementById('checkLowercase');
    const checkNumbers = document.getElementById('checkNumbers');
    const checkSymbols = document.getElementById('checkSymbols');

    // Metrics
    const entropyValue = document.getElementById('entropyValue');
    const crackTimeValue = document.getElementById('crackTimeValue');
    const warningsList = document.getElementById('warningsList');
    const warningsSection = document.getElementById('warningsSection');
    const breachResult = document.getElementById('breachResult');

    // Toggle Visibility
    toggleAnalyzerVisibility.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'text') {
            toggleAnalyzerVisibility.innerHTML = `<svg class="w-5 h-5 text-cyber-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;
        } else {
            toggleAnalyzerVisibility.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
        }
    });

    let timeout = null;
    passwordInput.addEventListener('input', () => {
        clearTimeout(timeout);
        const password = passwordInput.value;

        // Update Basic Checks
        updateBasicChecks(password);

        if (password.length === 0) {
            resetAnalyzerUI();
            return;
        }

        // Show Results Section
        analysisResults.classList.remove('hidden');

        timeout = setTimeout(() => {
            addLog('Analyzing password...', 'info');
            fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password })
            })
            .then(res => res.json())
            .then(data => updateAnalyzerResults(data))
            .catch(err => {
                console.error('Error:', err);
                addLog('Analysis failed.', 'error');
            });
        }, 500);
    });

    function updateBasicChecks(password) {
        lengthValue.innerText = password.length;

        const setStatus = (el, valid) => {
            if (valid) {
                el.className = 'flex items-center gap-2 text-cyber-success font-medium';
                el.querySelector('span').className = 'w-2 h-2 rounded-full bg-cyber-success shadow-[0_0_8px_rgba(16,185,129,0.5)]';
            } else {
                el.className = 'flex items-center gap-2 text-gray-500';
                el.querySelector('span').className = 'w-2 h-2 rounded-full bg-gray-600';
            }
        };

        setStatus(checkLength, password.length >= 8);
        setStatus(checkUppercase, /[A-Z]/.test(password));
        setStatus(checkLowercase, /[a-z]/.test(password));
        setStatus(checkNumbers, /[0-9]/.test(password));
        setStatus(checkSymbols, /[^A-Za-z0-9]/.test(password));
    }

    function resetAnalyzerUI() {
        analysisResults.classList.add('hidden');
        strengthBar.style.width = '0%';
        strengthBar.className = 'h-2.5 rounded-full transition-all duration-300 w-0 bg-cyber-700';
        strengthLabel.innerText = 'Enter a password';
        strengthScore.innerText = '';
        strengthLabel.className = 'text-white font-medium';
   
        updateBasicChecks('');
    }

    function updateAnalyzerResults(data) {
        addLog(`Analysis complete. Score: ${data.score}/4`, 'success');

        // Strength Bar
        let colorClass = 'bg-cyber-danger';
        let label = 'Very Weak';

        if (data.score === 1) { colorClass = 'bg-red-500'; label = 'Weak'; }
        if (data.score === 2) { colorClass = 'bg-cyber-warning'; label = 'Fair'; }
        if (data.score === 3) { colorClass = 'bg-blue-500'; label = 'Strong'; }
        if (data.score === 4) { colorClass = 'bg-cyber-success'; label = 'Very Strong'; }

        // Update bar width and color
        const width = (data.score === 0 ? 10 : data.score * 25) + '%';
        strengthBar.style.width = width;
        strengthBar.className = `h-2.5 rounded-full transition-all duration-300 ${colorClass} shadow-[0_0_10px_currentColor]`;

        strengthLabel.innerText = label;
        strengthLabel.className = `${colorClass.replace('bg-', 'text-')} font-bold uppercase tracking-wider`;
        strengthScore.innerText = `Score: ${data.score}/4`;

        // Metrics
        entropyValue.innerText = `${Math.round(data.entropy)} bits`;
        crackTimeValue.innerText = data.crack_time;

        // Warnings
        warningsList.innerHTML = '';
        if (data.warning || data.suggestions.length > 0) {
            warningsSection.classList.remove('hidden');
            let html = '';
            if (data.warning) html += `<li class="text-cyber-warning font-bold">${data.warning}</li>`;
            data.suggestions.forEach(s => {
                html += `<li>${s}</li>`;
            });
            warningsList.innerHTML = html;
        } else {
            warningsSection.classList.add('hidden');
        }

        // Breach Check
        breachResult.classList.remove('hidden');
        if (data.breach_count > 0) {
            breachResult.className = 'p-4 rounded-lg border border-cyber-danger bg-cyber-danger/10 text-cyber-danger';
            breachResult.innerHTML = `
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                        <h4 class="font-bold">Password Compromised!</h4>
                        <p class="text-sm opacity-90 mt-1">This password appears in <strong>${data.breach_count.toLocaleString()}</strong> known data breaches.</p>
                    </div>
                </div>
            `;
            addLog(`Breach ALERT: ${data.breach_count} matches found!`, 'error');
        } else {
            breachResult.className = 'p-4 rounded-lg border border-cyber-success bg-cyber-success/10 text-cyber-success';
            breachResult.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <h4 class="font-bold">No Breaches Found</h4>
                        <p class="text-sm opacity-90">This password has not been found in our database.</p>
                    </div>
                </div>
            `;
        }
    }

    // Generator Logic
    const genLength = document.getElementById('genLength');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const genCheckUpper = document.getElementById('genCheckUpper');
    const genCheckLower = document.getElementById('genCheckLower');
    const genCheckNumbers = document.getElementById('genCheckNumbers');
    const genCheckSymbols = document.getElementById('genCheckSymbols');
    const generateBtn = document.getElementById('generateBtn');
    const generatedPasswordDiv = document.getElementById('generatedPassword');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');

    const ICON_COPY = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`;
    const ICON_CHECK = `<svg class="w-5 h-5 text-cyber-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;

    genLength.addEventListener('input', () => {
        lengthDisplay.innerText = genLength.value;
    });

    generateBtn.addEventListener('click', () => {
        const payload = {
            length: parseInt(genLength.value),
            upper: genCheckUpper.checked,
            lower: genCheckLower.checked,
            numbers: genCheckNumbers.checked,
            symbols: genCheckSymbols.checked
        };

        generateBtn.innerText = 'Generating...';
        generateBtn.disabled = true;

        fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            generateBtn.innerText = 'Generate Password';
            generateBtn.disabled = false;

            if (data.password) {
                generatedPasswordDiv.innerText = data.password;
                generatedPasswordDiv.classList.remove('text-gray-500');
                generatedPasswordDiv.classList.add('text-cyber-accent');

                copyPasswordBtn.disabled = false;
                copyPasswordBtn.classList.remove('opacity-0');
                copyPasswordBtn.classList.add('opacity-100');
                copyPasswordBtn.innerHTML = ICON_COPY;

                addLog('New secure password generated.', 'success');
            } else if (data.error) {
                alert(data.error);
                addLog(`Generation error: ${data.error}`, 'error');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            generateBtn.innerText = 'Generate Password';
            generateBtn.disabled = false;
            addLog('Generation failed.', 'error');
        });
    });

    copyPasswordBtn.addEventListener('click', () => {
        const password = generatedPasswordDiv.textContent.trim();

        if (!password || password.includes('Click "Generate"')) return;

        const handleSuccess = () => {
            addLog('Password copied to clipboard.', 'success');
            
            copyPasswordBtn.innerHTML = ICON_CHECK;
            copyPasswordBtn.classList.add('bg-green-900/50');

            setTimeout(() => {
                copyPasswordBtn.innerHTML = ICON_COPY;
                copyPasswordBtn.classList.remove('bg-green-900/50');
            }, 2000);
        };

        const fallbackCopy = (text) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    handleSuccess();
                } else {
                    addLog('Failed to copy password.', 'error');
                }
            } catch (err) {
                console.error('Fallback copy failed', err);
                addLog('Failed to copy password.', 'error');
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(password)
                .then(() => handleSuccess())
                .catch(err => {
                    console.warn('Clipboard API failed, attempting fallback...', err);
                    fallbackCopy(password);
                });
        } else {
            fallbackCopy(password);
        }
    });

});
