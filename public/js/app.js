function renderIsLoggedOut() {
  const button = document.createElement('button');
  button.textContent = 'Login with GitHub';
  button.addEventListener('click', () => {
    window.location.assign('/api/v1/users/login');
  });

  const root = document.getElementById('root');

  root.appendChild(button);
}
const ul = document.createElement('ul');

async function getAllTweets() {
  // const root = document.getElementById('root')
  //create a UL to append to the root element
  ul.textContent = '';
  //get all tweets post endpoint
  const res = await fetch('/api/v1/posts/');
  const posts = await res.json();
  console.log(posts);
  const postLi = posts.reverse().map((post) => {
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.name = post.id;
    li.textContent = post.post;
    li.appendChild(deleteButton);
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
