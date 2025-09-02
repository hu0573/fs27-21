"use strict";
const postUl = document.getElementById("posts");
const countEl = document.getElementById("count");
const statusEl = document.getElementById("status");
const btnLoad = document.getElementById("btn-load");
const form = document.getElementById("create-form");
const inputTitle = document.getElementById("title");
const inputBody = document.getElementById("body");
const createStatusEl = document.getElementById("create-status");
const fetchData = async (url) => {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`http ${res.status}`);
    return res.json();
};
const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok)
        throw new Error(`http ${res.status}`);
    return res.json();
};
const renderPosts = (posts) => {
    console.log("posts", posts);
    if (!postUl)
        return;
    postUl.innerHTML = posts
        .map((p) => {
        var _a;
        return `
    <li>
    <b>${p.title}</b> (#${(_a = p.id) !== null && _a !== void 0 ? _a : "new"})<br/>
    </li>
    `;
    })
        .join("");
    if (!countEl)
        return;
    countEl.textContent = String(posts.length);
};
let postsState = [];
btnLoad === null || btnLoad === void 0 ? void 0 : btnLoad.addEventListener("click", async () => {
    //   alert("click btnLoad");
    if (!statusEl)
        return;
    statusEl.textContent = "Loading";
    statusEl.className = "status";
    try {
        const all = await fetchData("https://jsonplaceholder.typicode.com/posts");
        postsState = all.slice(0, 5);
        renderPosts(postsState);
        statusEl.textContent = "Load successfully";
        statusEl.className = "status ok";
    }
    catch (error) {
        statusEl.textContent = `error: ${error.message}`;
        statusEl.className = "status error";
    }
});
form === null || form === void 0 ? void 0 : form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!inputTitle)
        return;
    if (!inputBody)
        return;
    const title = inputTitle.value.trim();
    const body = inputBody.value.trim();
    const newItem = { title, body };
    postsState = [newItem, ...postsState];
    renderPosts(postsState);
    createStatusEl.textContent = "Submiting";
    try {
        const created = await postData("https://jsonplaceholder.typicode.com/posts", newItem);
        console.log(created);
        renderPosts(postsState);
        createStatusEl.textContent = "Submit successfully";
        createStatusEl.className = "status ok";
        form.reset();
    }
    catch (error) {
        postsState = postsState.filter((p) => p !== newItem);
        createStatusEl.textContent = "Submit failed";
        createStatusEl.className = "status error";
    }
});
