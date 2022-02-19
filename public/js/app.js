//GOES IN IS LOGGEDOUT.JSX
function renderIsLoggedOut() {
  //Creates a button.
  const button = document.createElement('button');
  //button says what on it?
  button.textContent = 'Login with GitHub';
  //add eventlistenener to the button so that when clicked it goes....
  button.addEventListener('click', () => {
    //here....
    window.location.assign('/api/v1/users/login');
  });
  // Where on the page is the button going to show?
  const root = document.getElementById('root');
  //append the button to the root element as a child of that element.
  root.appendChild(button);
}
//GOES IN SHOWALLTWEETS.jsx
async function logOut() {
  const button = document.createElement('button');
  button.textContent = 'LogOut';
  button.addEventListener('click', async (e) => {
    await fetch(`/api/v1/users/sessions/${e.target.name}`, {
      method: 'DELETE',
    });
    window.location.assign('/');
  });
  const root = document.getElementById('root');
  root.appendChild(button);
}

async function getAllTweets() {
  const ul = document.createElement('ul');
  //Why is this line here?
  ul.textContent = '';
  //Run to the database and get all the posts for this user:
  const res = await fetch('/api/v1/posts/');
  //Not sure what this line is doing?
  const posts = await res.json();
  //lets map through all the posts and display them on the page:
  //and we are showing them in reverse order:
  const postLi = posts.reverse().map((post) => {
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    //Why this line?
    deleteButton.name = post.id;
    //put each post in an LI:
    li.textContent = post.post;
    li.appendChild(deleteButton);
    //I am not sure I understand the e.target.name part....
    deleteButton.addEventListener('click', async (e) => {
      await fetch(`/api/v1/posts/${e.target.name}`, {
        method: 'DELETE',
      });
      await getAllTweets();
    });
    ul.appendChild(li);
  });
  document.getElementById('root').appendChild(ul);
}
//THIS FUNCTION GOES IN: SHOWTWEETS.JSX
async function renderIsLoggedIn(user) {
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
    await getAllTweets();
  });

  form.appendChild(textarea);
  form.appendChild(button);

  root.appendChild(form);
  await getAllTweets();
  await logOut();
}
//THIS FUNCTION GOES IN SHOWTWEETS.JSX:

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
