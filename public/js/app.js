function renderIsLoggedOut() {
  const button = document.createElement('button');
  button.textContent = 'Login with GitHub';
  button.addEventListener('click', () => {
    window.location.assign('/api/v1/users/login');
  });

  document.getElementById('root').appendChild(button);
}

function renderIsLoggedIn(user) {
  const root = document.getElementById('root');
  const p = document.createElement('p');
  p.textContent = user.username;
  root.appendChild(p);

  const form = document.createElement('form');
  const textarea = document.createElement('textarea');
  textarea.name = 'text';

  const button = document.createElement('button');
  button.textContent = 'Create Tweet';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    const text = fd.get('text');
    await fetch('/api/v1/posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: text }),
    });
  });

  form.appendChild(textarea);
  form.appendChild(button);

  root.appendChild(form);
}

async function main() {
  try {
    // check to see if logged in
    const res = await fetch('/api/v1/users/dashboard');
    if (!res.ok) throw new Error('Not logged in');

    // is logged in
    const user = await res.json();
    renderIsLoggedIn(user);
  } catch (error) {
    // not logged in
    renderIsLoggedOut();
  }
}

main();
