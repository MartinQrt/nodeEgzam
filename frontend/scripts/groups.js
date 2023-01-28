function getAuth() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "login.html";
  }

  return accessToken;
}

function addGroupOptions(groups) {
  const select = document.getElementById("groupSelect");
  select.replaceChildren();
  groups.forEach((group) => {
    const groupOption = document.createElement("option");
    groupOption.value = group._id;
    groupOption.innerHTML = group.name;
    select.appendChild(groupOption);
  });
}

function handleGroupClick(groupId, groupName) {
  window.location.href = `bills.html?groupId=${groupId}&groupName=${groupName}`;
}

function addGroupCards(groups) {
  const groupsContainer = document.getElementById("group-cards");
  groupsContainer.replaceChildren();
  groups.forEach((group) => {
    let groupCard = document.createElement("div");
    groupCard.className = "group-card";

    let groupNameText = document.createElement("p");
    groupNameText.className = "group-name-text";
    groupCard.appendChild(groupNameText);
    groupNameText.innerHTML = group.name;

    let groupIdText = document.createElement("p");
    groupIdText.className = "group-id-text";
    groupCard.appendChild(groupIdText);
    groupIdText.innerHTML = `ID: ${group._id}`;

    groupsContainer.appendChild(groupCard);

    groupCard.onclick = () => handleGroupClick(group._id, group.name);
  });
}

function fetchAllGroups() {
  fetch("http://localhost:8080/groups", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        response.text().then((text) => alert(text));
        return;
      }

      response.json().then((groups) => addGroupOptions(groups));
    })
    .catch((err) => {
      alert(err.toString());
    });
}

function fetchUserGroups() {
  const accessToken = getAuth();

  fetch("http://localhost:8080/accounts", {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "login.html";
        } else {
          response.text().then((text) => alert(text));
        }

        return;
      }

      response.json().then((groups) => addGroupCards(groups));
    })
    .catch((err) => {
      alert(err.toString());
    });
}

function joinGroup(event) {
  event.preventDefault();
  const selectedGroup = document.getElementById("groupSelect").value;
  const accessToken = getAuth();

  fetch("http://localhost:8080/accounts", {
    method: "POST",
    cors: true,
    headers: {
      authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId: selectedGroup }),
  })
    .then((response) => {
      if (!response.ok) {
        response.text().then((result) => alert(result));
        return;
      }

      response.json().then(() => {
        fetchAllGroups();
        fetchUserGroups();
      });
    })
    .catch((err) => {
      alert(err);
    });
}

function createGroup(event) {
  event.preventDefault();
  const createGroupForm = document.getElementById("create-group-form");
  const groupName = createGroupForm.groupName.value;
  const accessToken = getAuth();

  fetch("http://localhost:8080/groups", {
    method: "POST",
    cors: true,
    headers: {
      authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupName }),
  })
    .then((response) => {
      if (!response.ok) {
        response.text().then((result) => alert(result));
        return;
      }

      response.json().then(() => {
        alert("Group added");
        fetchAllGroups();
        fetchUserGroups();
      });
    })
    .catch((err) => {
      alert(err);
    });
}

const createGroupButton = document.getElementById("create-group-button");
createGroupButton.addEventListener("click", createGroup);

const joinGroupButton = document.getElementById("join-group-button");
joinGroupButton.addEventListener("click", joinGroup);

fetchAllGroups();
fetchUserGroups();
