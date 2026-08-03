const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');

// Toggle forms
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    messageDiv.textContent = '';
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    messageDiv.textContent = '';
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: document.getElementById('signupName').value,
          email: document.getElementById('signupEmail').value,
          password: document.getElementById('signupPassword').value
        })
    });
    const data = await res.json();
    messageDiv.textContent = data.message;
    messageDiv.style.color = res.ok ? 'green' : 'red';
    if (res.ok) signupForm.reset();
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('loginEmail').value,
          password: document.getElementById('loginPassword').value
        })
    });
    const data = await res.json();
    messageDiv.textContent = data.message;
    messageDiv.style.color = res.ok ? 'green' : 'red';
});

// Fetch All Users
document.getElementById('fetchUsersBtn').addEventListener('click', async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    const usersDisplay = document.getElementById('usersDisplay');
    usersDisplay.textContent = JSON.stringify(data, null, 2);
    usersDisplay.classList.remove('hidden');
});