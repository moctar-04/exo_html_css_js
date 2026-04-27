  
    // ============ Données ============
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentUserEditId = null;
    let currentDeleteCallback = null;
    let currentTaskFilter = 'all';

    // ============ Utilitaires ============
    function saveData() {
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getActiveUsers() {
      return users.filter(u => !u.archived);
    }

    function getUserById(id) {
      return users.find(u => u.id === id);
    }

    function getTasksByUserId(userId) {
      return tasks.filter(t => t.userId === userId);
    }

    // ============ Gestion des utilisateurs ============
    function toggleUserForm() {
      const form = document.getElementById('userForm');
      form.classList.toggle('hidden');
      document.getElementById('userNom').value = '';
      document.getElementById('userPrenom').value = '';
    }

    function addUser() {
      const nom = document.getElementById('userNom').value.trim();
      const prenom = document.getElementById('userPrenom').value.trim();

      if (!nom || !prenom) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      const user = {
        id: Date.now(),
        nom,
        prenom,
        archived: false
      };

      users.push(user);
      saveData();
      toggleUserForm();
      renderAll();
    }

    function startEditUser(id) {
      const user = getUserById(id);
      if (!user) return;

      currentUserEditId = id;
      document.getElementById('editUserNom').value = user.nom;
      document.getElementById('editUserPrenom').value = user.prenom;
      
      document.getElementById('editUserForm').classList.remove('hidden');
      document.getElementById('userForm').classList.add('hidden');
    }

    function saveUserEdit() {
      const nom = document.getElementById('editUserNom').value.trim();
      const prenom = document.getElementById('editUserPrenom').value.trim();

      if (!nom || !prenom) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      const userIndex = users.findIndex(u => u.id === currentUserEditId);
      if (userIndex !== -1) {
        users[userIndex].nom = nom;
        users[userIndex].prenom = prenom;
        saveData();
      }

      cancelUserEdit();
      renderAll();
    }

    function cancelUserEdit() {
      currentUserEditId = null;
      document.getElementById('editUserForm').classList.add('hidden');
    }

    function archiveUser(id) {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        users[userIndex].archived = !users[userIndex].archived;
        saveData();
        renderAll();
      }
    }

    function deleteUser(id) {
      showConfirmModal('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action supprimera également toutes ses tâches.', () => {
        users = users.filter(u => u.id !== id);
        tasks = tasks.filter(t => t.userId !== id);
        saveData();
        renderAll();
      });
    }

    // ============ Gestion des tâches ============
    function addTask() {
      const title = document.getElementById('taskTitle').value.trim();
      const userId = document.getElementById('taskUserSelect').value;

      if (!title) {
        alert('Veuillez entrer un titre pour la tâche');
        return;
      }

      const task = {
        id: Date.now(),
        title,
        userId: userId ? parseInt(userId) : null,
        completed: false
      };

      tasks.push(task);
      saveData();
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskUserSelect').value = '';
      renderAll();
    }

    function toggleTask(id) {
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveData();
        renderTasks();
        updateCompletedCount();
      }
    }

    function updateTaskUser(taskId, userId) {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].userId = userId ? parseInt(userId) : null;
        saveData();
      }
    }

    function deleteTask(id) {
      showConfirmModal('Êtes-vous sûr de vouloir supprimer cette tâche ?', () => {
        tasks = tasks.filter(t => t.id !== id);
        saveData();
        renderAll();
      });
    }

    // ============ Filtres ============
    function setTaskFilter(filter) {
      currentTaskFilter = filter;
      
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-slate-700');
      });
      
      const activeBtn = document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1));
      activeBtn.classList.remove('bg-slate-700');
      activeBtn.classList.add('bg-indigo-600');
      
      renderTasks();
    }

    // ============ Modal ============
    function showConfirmModal(message, callback) {
      document.getElementById('confirmMessage').textContent = message;
      currentDeleteCallback = callback;
      document.getElementById('confirmModal').classList.remove('hidden');
      document.getElementById('confirmModal').classList.add('flex');
    }

    function closeConfirmModal() {
      document.getElementById('confirmModal').classList.add('hidden');
      document.getElementById('confirmModal').classList.remove('flex');
      currentDeleteCallback = null;
    }

    function confirmDelete() {
      if (currentDeleteCallback) {
        currentDeleteCallback();
      }
      closeConfirmModal();
    }

    // ============ Rendu ============
    function renderUsers() {
      const activeUsers = getActiveUsers();
      const list = document.getElementById('usersList');
      document.getElementById('userCount').textContent = activeUsers.length;

      if (activeUsers.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-center py-4">Aucun utilisateur</p>';
        return;
      }

      list.innerHTML = activeUsers.map(user => {
        const userTasks = getTasksByUserId(user.id);
        const completedTasks = userTasks.filter(t => t.completed).length;
        
        return `
          <div class="bg-slate-850 rounded-xl p-4 flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium truncate">${user.prenom} ${user.nom}</h3>
              <p class="text-sm text-slate-400">${userTasks.length} tâche(s) • ${completedTasks} terminée(s)</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="startEditUser(${user.id})" class="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors" title="Modifier">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button onclick="archiveUser(${user.id})" class="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors" title="Archiver">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </button>
              <button onclick="deleteUser(${user.id})" class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors" title="Supprimer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderTasks() {
      const list = document.getElementById('tasksList');
      const userFilter = document.getElementById('userFilter').value;
      
      let filteredTasks = [...tasks];
      
      if (userFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.userId === parseInt(userFilter));
      }
      
      if (currentTaskFilter === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.completed);
      } else if (currentTaskFilter === 'pending') {
        filteredTasks = filteredTasks.filter(t => !t.completed);
      }

      document.getElementById('taskCount').textContent = filteredTasks.length;

      if (filteredTasks.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-center py-4">Aucune tâche</p>';
        return;
      }

      list.innerHTML = filteredTasks.map(task => {
        const user = task.userId ? getUserById(task.userId) : null;
        const userName = user ? `${user.prenom} ${user.nom}` : 'Non assigné';
        
        return `
          <div class="bg-slate-850 rounded-xl p-4 flex items-center gap-3 ${task.completed ? 'opacity-60' : ''}">
            <button onclick="toggleTask(${task.id})" class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-500'}">
              ${task.completed ? '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
            </button>
            <div class="flex-1 min-w-0">
              <p class="font-medium truncate ${task.completed ? 'line-through text-slate-500' : ''}">${task.title}</p>
              <p class="text-xs text-slate-400">${userName}</p>
            </div>
            <select onchange="updateTaskUser(${task.id}, this.value)" class="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-violet-500">
              <option value="" ${!task.userId ? 'selected' : ''}>Non assigné</option>
              ${getActiveUsers().map(u => `<option value="${u.id}" ${task.userId === u.id ? 'selected' : ''}>${u.prenom} ${u.nom}</option>`).join('')}
            </select>
            <button onclick="deleteTask(${task.id})" class="flex-shrink-0 p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors" title="Supprimer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        `;
      }).join('');
    }

    function updateUserSelects() {
      const activeUsers = getActiveUsers();
      const taskSelect = document.getElementById('taskUserSelect');
      const filterSelect = document.getElementById('userFilter');
      
      const taskOptions = '<option value="">Sélectionner un utilisateur</option>' + 
        activeUsers.map(u => `<option value="${u.id}">${u.prenom} ${u.nom}</option>`).join('');
      
      taskSelect.innerHTML = taskOptions;
      filterSelect.innerHTML = '<option value="all">Tous les utilisateurs</option>' + 
        activeUsers.map(u => `<option value="${u.id}">${u.prenom} ${u.nom}</option>`).join('');
    }

    function updateCompletedCount() {
      const completed = tasks.filter(t => t.completed).length;
      document.getElementById('completedCount').textContent = `✓ ${completed} terminées`;
    }

    function renderAll() {
      renderUsers();
      renderTasks();
      updateUserSelects();
      updateCompletedCount();
    }

    // ============  Initialisation  ============
    renderAll();
 