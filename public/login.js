const loginUser  = async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("executing login")
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    console.log('completed')
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem("id",data.user.id)
        alert('Login successful');
        window.location.href = 'dashboard.html';
    } else {
        alert('Login failed');
    }
};
const goToSignup = async(event) =>{
    event.preventDefault();
    window.location.href = 'signup.html';
}
document.addEventListener("DOMContentLoaded",(event) => {
    document.getElementById('login-form').addEventListener('submit', loginUser );
    document.getElementById("goToSignup").addEventListener("click", goToSignup );
})
