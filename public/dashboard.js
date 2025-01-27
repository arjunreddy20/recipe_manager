
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
        //console.log(invites);

        if (invites.length > 0) {
            invites.forEach(invite => {
                //console.log('Invite:', invite); 
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
const fetchDashboard = async () => {
const followersListContainer = document.getElementById('followers-list-container');
const followingListContainer = document.getElementById('following-list-container');
const showFollowersBtn = document.getElementById('showFollowers');
const showFollowingBtn = document.getElementById('showFollowing');
const userId = localStorage.getItem('id');

showFollowersBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(`/api/dashboard/followers/${userId}`);
    const followers = await response.json();
    followersListContainer.innerHTML = followers.map(follower =>
     `
      <div class = "follower">
        <p><strong>${follower.Follower.name}</strong>
        <button class="remove-follower-btn" data-id="${follower.Follower.id}">Remove</button></p>
      </div>
    `).join('');
    document.querySelectorAll('.remove-follower-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const followerId = button.getAttribute('data-id');
        try {
          const response = await fetch('/api/dashboard/remove-follower', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followerId,userId }),
          });
          if (response.ok) {
            button.parentNode.remove();
          } else {
            alert('Failed to remove follower');
          }
        } catch (error) {
          alert(`Failed to remove follower: ${error.message}`);
        }
      });
    });
  } catch (error) {
    alert(`Failed to fetch followers: ${error.message}`);
  }
});

showFollowingBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(`/api/dashboard/following/${userId}`);
    const following = await response.json();
    followingListContainer.innerHTML = following.map(author => `
      <div class = "following">
        <p>${author.Author.name}
        <button class="show-recipes-btn" data-id="${author.Author.id}">Show Recipes</button>
        <button class="show-favorites-btn" data-id="${author.Author.id}">Favorites</button>
        <button class="show-collections-btn" data-id="${author.Author.id}">Collections</button>
        <button class="unfollow-btn" data-id="${author.Author.id}">Remove</button></p>
        <hr>
      </div>
    `).join('');
    document.querySelectorAll('.show-recipes-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const authorId = button.getAttribute('data-id');
        try {
          const response = await fetch(`/api/dashboard/recipes?authorId=${authorId}`);
          const recipes = await response.json();
          const recipesHtml = recipes.map(recipe => `
            <div class="recipe" data-id="${recipe.id}">
              <h2>${recipe.title}</h2>
              <p><strong>Ingredients required:</strong> ${recipe.ingredients}</p>
              <p><strong>Instructions to follow:</strong> ${recipe.instructions}</p>
              <p><strong>Cooking Time:</strong> ${recipe.cookingTime} hours</p>
              <p><strong>Serves Upto:</strong> ${recipe.servings}</p>
              <h4><strong>Posted By:</strong>${recipe.name}<h4>
              <img src="${recipe.image}" alt="${recipe.title}">
            </div>

          `).join('');
          const newTab = window.open('recipes.html', '_blank');
          newTab.document.write(`
            <html>
              <head>
                <title>Recipes</title>
                <link rel="stylesheet" href="styles.css">
              </head>
              <body>
                <h1>Recipes</h1>
                <div id="recipes-container">${recipesHtml}</div>
              </body>
            </html>
          `);
        } catch (error) {
          alert(`Failed to fetch recipes: ${error.message}`);
        }
      });
    });
    document.querySelectorAll('.show-favorites-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const authorId = button.getAttribute('data-id');
        try {
          const response = await fetch(`/api/dashboard/recipes/favorites?authorId=${authorId}`);
          const favorites = await response.json();
          //console.log("sasa",favorites);
          const favoritesHtml = favorites.map(favorite => `
            <div class="recipe" data-id="${favorite.Recipe.id}">
              <h2>${favorite.Recipe.title}</h2>
              <p><strong>Ingredients required:</strong> ${favorite.Recipe.ingredients}</p>
              <p><strong>Instructions to follow:</strong> ${favorite.Recipe.instructions}</p>
              <p><strong>Cooking Time:</strong> ${favorite.Recipe.cookingTime} hours</p>
              <p><strong>Serves Upto:</strong> ${favorite.Recipe.servings}</p>
              <h4><strong>Posted By:</strong>${favorite.Recipe.name}<h4>
              <img src="${favorite.Recipe.image}" alt="${favorite.Recipe.title}">
            </div>
          `).join('');
          const newTab = window.open('favorates.html', '_blank');
          newTab.document.write(`
            <html>
              <head>
                <title>Favorates</title>
                <link rel="stylesheet" href="styles.css">
              </head>
              <body>
                <h1>Recipes</h1>
                <div id="recipes-container">${favoritesHtml}</div>
              </body>
            </html>
          `);
        } catch (error) {
            //console.log(error);
          alert(`Failed to fetch favorites: ${error.message}`);
        }
      });
    });
    document.querySelectorAll('.show-collections-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const authorId = button.getAttribute('data-id');
        try {
          const response = await fetch(`/api/dashboard/my-collections?authorId=${authorId}`);
          const collections = await response.json();
          console.log(collections);
          renderMyCollections(collections);
        } catch (error) {
            console.log(error);
          alert(`Failed to fetch collections: ${error.message}`);
        }
      });
    });

    const renderMyCollections = (myCollections) => {
        const addedCollectionGroupNames = new Set();
        const myCollectionsContainerHTML = myCollections.map((myCollection) => {
          if (!addedCollectionGroupNames.has(myCollection.collectionGroupName)) {
            addedCollectionGroupNames.add(myCollection.collectionGroupName);
            return `
              <button id="my-collection-btn" data-id="${myCollection.id}" data-collectionGroupName = ${myCollection.collectionGroupName} data-userId = ${myCollection.userId}>${myCollection.collectionGroupName}</button>
            `;
          }
        }).join('');
        const newTab = window.open('collections.html', '_blank');
        newTab.document.write(`
          <html>
            <head>
              <title>Collections</title>
              <link rel="stylesheet" href="styles.css">
            </head>
            <body>
              <h1>Collections</h1>
              <div id="recipes-container">${myCollectionsContainerHTML}</div>
              <div id="groupHeading"></div>
              <div id="renderedRecipes-container"></div>
            </body>
          </html>
        `);
        newTab.document.getElementById('recipes-container').addEventListener('click', async (event) => {
            if (event.target.id === 'my-collection-btn') {
              const groupName = event.target.getAttribute('data-collectionGroupName');
              const userId = event.target.getAttribute('data-userId');
              const collectionId = event.target.getAttribute('data-id');
              try {
                const response = await fetch(`/api/my-collections/${userId}/${groupName}/recipes`);
                if (response.ok) {
                  const recipes = await response.json();
                  console.log(recipes)
                  const groupHeading = newTab.document.getElementById('groupHeading');
                  groupHeading.innerHTML = `<h3>${groupName}</h3>`;
                  const renderedRecipesContainer = newTab.document.getElementById('renderedRecipes-container');
                  renderedRecipesContainer.innerHTML = recipes.map(recipe => {
                    return `
                      <div class="recipe" data-id="${recipe.id}">
                        <h2>${recipe.title}</h2>
                        <p><strong>Ingredients required:</strong> ${recipe.ingredients}</p>
                        <p><strong>Instructions to follow:</strong> ${recipe.instructions}</p>
                        <p><strong>Cooking Time:</strong> ${recipe.cookingTime} hours</p>
                        <p><strong>Serves Upto:</strong> ${recipe.servings}</p>
                        <h4><strong>Posted By:</strong>${recipe.name}<h4>
                        <img src="${recipe.image}" alt="${recipe.title}">
                      </div>
                    `;
                  }).join('');
                } else {
                  alert('Failed to fetch collections');
                }
              } catch (error) {
                console.log(error);
                alert(`Failed to fetch collections: ${error.message}`);
              }
            }
        })
    }

    document.querySelectorAll('.unfollow-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const authorId = button.getAttribute('data-id');
        try {
          const response = await fetch('/api/dashboard/unfollow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authorId,userId }),
          });
          if (response.ok) {
            button.parentNode.remove();
          } else {
            alert('Failed to unfollow');
          }
        } catch (error) {
          alert(`Failed to unfollow: ${error.message}`);
        }
      });
    });

  } catch (error) {
    alert(`Failed to fetch following: ${error.message}`);
  }
});

};

const profiledetails = async () => {
    const id = localStorage.getItem('id');
    document.getElementById('edit-profile-btn').addEventListener('click', async () => {
        const response = await fetch(`/api/users/profile/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        const user = await response.json(); 
        const div = document.getElementById("profileForm")
        div.innerHTML = `
        <form>
        name: <input type="text" id="name" value="${user.name}"><br>
        email: <input type="text" id="email" value="${user.email}"><br>
        <button id="updateProfile">Update</button>
        </form>`

        document.getElementById("updateProfile").addEventListener("click", async (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const response = await fetch(`/api/users/profile/${id}`,{
                method:"PUT",
                headers:{
                    "Authorization":`Bearer ${localStorage.getItem("token")}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({name,email})
            })
            if(response.ok){
                alert('profile updated successfully')
            }
            else{
                alert("error",response.message)
            }
        });
    });

}

const newFeed = async () => {
  const id = localStorage.getItem("id");
  try {
    const response = await fetch(`/api/dashboard/recipes/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    });
    const recipes = await response.json();
    const feed = document.getElementById("newFeed");
    feed.innerHTML = recipes.map(recipe => `
      <div class="recipe" data-id="${recipe.id}">
        <h2>${recipe.title}</h2>
        <p><strong>Ingredients required:</strong> ${recipe.ingredients}</p>
        <p><strong>Instructions to follow:</strong> ${recipe.instructions}</p>
        <p><strong>Cooking Time:</strong> ${recipe.cookingTime} hours</p>
        <p><strong>Serves Upto:</strong> ${recipe.servings}</p>
        <h4><strong>Posted By:</strong>${recipe.name}<h4>
        <img src="${recipe.image}" alt="${recipe.title}">
      </div>
    `).join('');
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
    await fetchDashboard();
    await fetchInvites();
    await profiledetails();
    await newFeed();
  });
