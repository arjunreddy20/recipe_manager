const fetchInvites = async () => {
    const userId = localStorage.getItem('id');
    try {
        const response = await fetch(`/api/recipes/invites/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
        });
        const invites = await response.json();
        console.log(invites);

        if (invites.length > 0) {
            invites.forEach(invite => {
                console.log('Invite:', invite); 
                showInviteModal(invite);
            });
        } else {
            console.log('No pending invites.');
        }
    } catch (error) {
        console.log('Error fetching invites:', error);
    }
};

const showInviteModal = (invite) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>You have a pending invite from user: ${invite.Follower.name}. Do you want to accept or reject?</p>
            <button id="accept-${invite.id}">Accept</button>
            <button id="reject-${invite.id}">Reject</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById(`accept-${invite.id}`).onclick = () => handleInviteResponse(invite.id, 'accept');
    document.getElementById(`reject-${invite.id}`).onclick = () => handleInviteResponse(invite.id, 'reject');
    
};

const handleInviteResponse = async (inviteId, action) => {
    const userId = localStorage.getItem('id');
    const response = await fetch(`/api/recipes/invites/${action}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inviteId, userId })
    });

    if (response.ok) {
        alert(`Invite ${action}ed successfully.`);
        window.location.reload();
    } else {
        console.log('Error updating invite status:', response.statusText);
    }
};


document.addEventListener('DOMContentLoaded', fetchInvites);
