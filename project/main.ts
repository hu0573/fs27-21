type Post = {
  id?: number;
  userId?: number;
  title: string;
  body: string;
};

const postUl = document.getElementById("posts");
const countEl = document.getElementById("count");
const statusEl = document.getElementById("status");
const btnLoad = document.getElementById("btn-load");
const form = document.getElementById("create-form") as HTMLFormElement | null;
const inputTitle = document.getElementById("title") as HTMLInputElement;
const inputBody = document.getElementById("body") as HTMLTextAreaElement;
const createStatusEl = document.getElementById("create-status") as HTMLElement;

const fetchData = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
};

const postData = async <T>(url: string, data: Post): Promise<T> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
};

const renderPosts = (posts: Post[]) => {
  console.log("posts", posts);
  if (!postUl) return;
  postUl.innerHTML = posts
    .map(
      (p) => `
    <li>
    <b>${p.title}</b> (#${p.id ?? "new"})<br/>
    </li>
    `
    )
    .join("");
  if (!countEl) return;
  countEl.textContent = String(posts.length);
};
let postsState: Post[] = [];

btnLoad?.addEventListener("click", async () => {
  //   alert("click btnLoad");
  if (!statusEl) return;
  statusEl.textContent = "Loading";
  statusEl.className = "status";
  try {
    const all = await fetchData<Post[]>(
      "https://jsonplaceholder.typicode.com/posts"
    );
    postsState = all.slice(0, 5);
    renderPosts(postsState);
    statusEl.textContent = "Load successfully";
    statusEl.className = "status ok";
  } catch (error: any) {
    statusEl.textContent = `error: ${error.message}`;
    statusEl.className = "status error";
  }
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!inputTitle) return;
  if (!inputBody) return;
  const title = inputTitle.value.trim();
  const body = inputBody.value.trim();
  const newItem: Post = { title, body };
  postsState = [newItem, ...postsState];
  renderPosts(postsState);
  createStatusEl.textContent = "Submiting";
  try {
    const created = await postData<Post>(
      "https://jsonplaceholder.typicode.com/posts",
      newItem
    );
    console.log(created);
    renderPosts(postsState);
    createStatusEl.textContent = "Submit successfully";
    createStatusEl.className = "status ok";
    form.reset();
  } catch (error) {
    postsState = postsState.filter((p) => p !== newItem);
    createStatusEl.textContent = "Submit failed";
    createStatusEl.className = "status error";
  }
});
