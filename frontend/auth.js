/* =========================================================
   SkillSprout — auth.js
   Handles all interactivity on the login/signup page.
   ========================================================= */

/* ---- 1. TAB SWITCHING (Log in ↔ Sign up) ---- */
var tabLogin   = document.getElementById('tabLogin');
var tabSignup  = document.getElementById('tabSignup');
var loginForm  = document.getElementById('loginForm');
var signupForm = document.getElementById('signupForm');

function showLogin() {
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  tabLogin.classList.add('auth-tab--active');
  tabSignup.classList.remove('auth-tab--active');
  document.title = 'Log in — SkillSprout';
}

function showSignup() {
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  tabSignup.classList.add('auth-tab--active');
  tabLogin.classList.remove('auth-tab--active');
  document.title = 'Sign up — SkillSprout';
}

tabLogin.addEventListener('click', showLogin);
tabSignup.addEventListener('click', showSignup);

// The "Sign up" / "Log in" text links inside each form also switch tabs
document.getElementById('switchToSignup').addEventListener('click', function(e) {
  e.preventDefault();
  showSignup();
});
document.getElementById('switchToLogin').addEventListener('click', function(e) {
  e.preventDefault();
  showLogin();
});


/* ---- 2. SHOW / HIDE PASSWORD ---- */
document.querySelectorAll('.toggle-pw').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var targetId = btn.getAttribute('data-target');
    var input = document.getElementById(targetId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  });
});


/* ---- 3. PASSWORD STRENGTH METER ---- */
var pwInput      = document.getElementById('signupPassword');
var strengthFill = document.getElementById('strengthFill');
var strengthLabel = document.getElementById('strengthLabel');

pwInput.addEventListener('input', function() {
  var pw = pwInput.value;
  var score = 0;

  if (pw.length >= 8)               score++;  // length check
  if (/[A-Z]/.test(pw))             score++;  // has uppercase
  if (/[0-9]/.test(pw))             score++;  // has number
  if (/[^A-Za-z0-9]/.test(pw))      score++;  // has special char

  var widths = ['0%', '25%', '50%', '75%', '100%'];
  var colors = ['', '#E53935', '#FB8C00', '#FDD835', '#43A047'];
  var labels = ['', 'Too weak', 'Weak', 'Good', 'Strong'];

  strengthFill.style.width = widths[score];
  strengthFill.style.backgroundColor = colors[score];
  strengthLabel.textContent = labels[score];
  strengthLabel.style.color = colors[score];
});


/* ---- 4. ROLE TOGGLE (Parent / Instructor) ---- */
var roleBtns       = document.querySelectorAll('.role-btn');
var specialtyGroup = document.getElementById('specialtyGroup');

roleBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Remove active from all, add to clicked
    roleBtns.forEach(function(b) { b.classList.remove('role-btn--active'); });
    btn.classList.add('role-btn--active');

    // Show specialty dropdown only for instructors
    if (btn.getAttribute('data-role') === 'instructor') {
      specialtyGroup.classList.remove('hidden');
    } else {
      specialtyGroup.classList.add('hidden');
    }
  });
});


/* ---- 5. BASIC FORM VALIDATION ---- */
document.getElementById('loginBtn').addEventListener('click', function() {
  var email = document.getElementById('loginEmail').value.trim();
  var pw    = document.getElementById('loginPassword').value;

  if (!email || !pw) {
    alert('Please fill in both email and password.');
    return;
  }
  // In a real app, you'd send these to your backend with fetch().
  // For now, just show a message.
  alert('Login submitted! (Backend not connected yet)');
});

document.getElementById('signupBtn').addEventListener('click', function() {
  var first  = document.getElementById('signupFirst').value.trim();
  var email  = document.getElementById('signupEmail').value.trim();
  var pw     = document.getElementById('signupPassword').value;
  var agreed = document.getElementById('agreeTerms').checked;

  if (!first || !email || !pw) {
    alert('Please fill in all required fields.');
    return;
  }
  if (pw.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }
  if (!agreed) {
    alert('Please agree to the Terms of Service to continue.');
    return;
  }
  alert('Account created! (Backend not connected yet)');
});
