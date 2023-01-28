const queryParams = document.location.search;
const urlParams = new URLSearchParams(queryParams);
const selectedGroupId = urlParams.get('groupId');
const selectedGroupName = urlParams.get('groupName');

const header = document.getElementById('header');
header.innerHTML = `Bills for ${selectedGroupName}`;

function getAuth() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = 'login.html';
    }

    return accessToken;
}

function addBills(bills) {
    const billsTable = document.getElementById('bills-table');
    const header = billsTable.firstElementChild;
    billsTable.replaceChildren();
    billsTable.appendChild(header);
    bills.forEach(bill => {
        const row = document.createElement('tr');
        const amountCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        amountCell.innerHTML = bill.amount;
        descriptionCell.innerHTML = bill.description;

        row.appendChild(amountCell);
        row.appendChild(descriptionCell);
        billsTable.appendChild(row);
    })
}

function fetchBills(groupId) {
    const accessToken = getAuth();

    fetch(`http://localhost:8080/bills/${groupId}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
            } else {
                response.text().then(text => alert(text));
            }
            
            return;
        }

        response.json().then(groups => addBills(groups));
    }).catch((err) => {
        alert(err.toString());
    });
}

function addBill(event) {
    event.preventDefault();
    const accessToken = getAuth();
    const addBillForm = document.getElementById('add-bill-form');
    const amount = addBillForm.amount.value;
    const description = addBillForm.description.value;

    fetch(`http://localhost:8080/bills`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: selectedGroupId, amount, description })
    }).then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
            } else {
                response.text().then(text => alert(text));
            }
            
            return;
        }

        response.json().then(() => fetchBills(selectedGroupId));
    }).catch((err) => {
        alert(err.toString());
    });
}

const addBillButton = document.getElementById('add-bill-button');
addBillButton.addEventListener('click', addBill);

fetchBills(selectedGroupId);