
const BASE_URL = "http://localhost:3000";
let row = null;

function retrieveData() {
    const subject = document.getElementById("subject").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    
    if (!subject || !name || !email || !message) {
        return null;
    }
    
    return {
        subject: subject,
        name: name,
        email: email,
        message: message
    };
}

async function Submit() {
    const dataEntered = retrieveData();
    if (!dataEntered) {
        alert("All fields are required. Please fill them out!");
        document.getElementById("msg").innerHTML = "<p style='color:red;'>All fields are required. Please fill them out!</p>";
        return;
    }

    const url = row === null ? `${BASE_URL}/contactus/add` : `${BASE_URL}/contactus/update/${row.dataset.id}`;
    const method = row === null ? 'POST' : 'PUT';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataEntered),
        });

        if (response.ok) {
            const result = await response.json();
            alert("Message sent successfully! We will get back to you soon.\n\nMessage ID: " + result.id + "\nSubject: " + dataEntered.subject);
            document.getElementById("msg").innerHTML = "<p style='color:green;'>Message sent successfully! Message ID: " + result.id + "</p>";
            fetchAndDisplayData();
            document.getElementById("subject").value = "";
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
            if (row) row.style.backgroundColor = "";
            row = null;
        } else {
            const errorData = await response.json();
            alert("Error sending message: " + (errorData.error || "Unknown error"));
            document.getElementById("msg").innerHTML = "<p style='color:red;'>Error sending message!</p>";
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Network error! Please check your internet connection and try again.");
        document.getElementById("msg").innerHTML = "<p style='color:red;'>An error occurred!</p>";
    }
}

async function fetchAndDisplayData() {
    try {
        const response = await fetch(`${BASE_URL}/contactus/get`);
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched data:', data);

            const messagesContainer = document.getElementById('messages-list');
            if (messagesContainer) {
                displayMessages(data);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages-list');
    if (!messagesContainer) return;
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p>No messages found.</p>';
        return;
    }
    
    let html = '<h3>Recent Messages</h3><table border="1" style="width:100%; border-collapse: collapse;">';
    html += '<tr><th>ID</th><th>Subject</th><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr>';
    
    messages.forEach(message => {
        html += `<tr>
            <td>${message.id}</td>
            <td>${message.subject}</td>
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.message.substring(0, 50)}${message.message.length > 50 ? '...' : ''}</td>
            <td>${new Date(message.created_at).toLocaleDateString()}</td>
        </tr>`;
    });
    
    html += '</table>';
    messagesContainer.innerHTML = html;
}


async function loginform(event) {
    event.preventDefault();
    
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;
    
    if (!username || !password) {
        alert("Please fill in all fields");
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert("Login successful!");
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error || "Login failed");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred during login");
    }
}


async function signupform(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;
    const confirmPassword = document.getElementById("confirm-pass").value;
    
    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("Registration successful! Please login.");
            window.location.href = 'login.html';
        } else {
            alert(data.error || "Registration failed");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred during registration");
    }
}



function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'home.html';
}

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
    }
}

function loadPage(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'dashboard.html':
        case 'orders.html':
        case 'wallet.html':
            checkAuth();
            break;
    }
});

