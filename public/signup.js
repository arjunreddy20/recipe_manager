const signupUser    = async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });
    if (response.ok) {
        alert('Signup successful');
        window.location.href = 'login.html';
    } else {
        alert('Signup failed');
    }
};



const goToLogin = async (event) => {
    event.preventDefault()
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('signup-form').addEventListener('submit', signupUser );
    document.getElementById("goToLogin").addEventListener("click",goToLogin);
});