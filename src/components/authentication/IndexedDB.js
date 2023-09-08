// indexedDB.js
const dbName = 'ManagementDatabase';
const dbVersion = 1;
let db;
const DB_NAME = 'ManagementDatabase';
const DB_VERSION = 1;
const TASKS_OBJECT_STORE = 'tasks';
const USERS_OBJECT_STORE = 'users';
const TEAMS_OBJECT_STORE = 'teams';


export async function openDatabase() {
    if (!db) {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create the tasks object store
            if (!db.objectStoreNames.contains(TASKS_OBJECT_STORE)) {
                const taskStore = db.createObjectStore(TASKS_OBJECT_STORE, { keyPath: 'id', autoIncrement: true });

                // Create an index for the 'status' field
                taskStore.createIndex('statusIndex', 'status', { unique: false });

                // Create an index for the 'dueDate' field
                taskStore.createIndex('dueDateIndex', 'dueDate', { unique: false });
            }

            // Create the users object store
            if (!db.objectStoreNames.contains(USERS_OBJECT_STORE)) {
                db.createObjectStore(USERS_OBJECT_STORE, { keyPath: 'email' });
            }

            // Create the users object store
            if (!db.objectStoreNames.contains(TEAMS_OBJECT_STORE)) {
                db.createObjectStore(TEAMS_OBJECT_STORE, { keyPath: 'teams', autoIncrement: true });
            }
        };

        db = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.error);
        });
    }
    return db;
}



export function addUser(user) {
    return new Promise(async (resolve, reject) => {
        if (!db) await openDatabase();

        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');

        const request = objectStore.add(user);

        request.onsuccess = () => {
            console.log('User added to the database');
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error adding user:', event.target.error);
            reject(event.target.error);
        };
    });
}

export function getUser(email) {
    return new Promise(async (resolve, reject) => {
        if (!db) await openDatabase();

        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');

        const request = objectStore.get(email);

        request.onsuccess = () => {
            const user = request.result;
            resolve(user);
        };

        request.onerror = (event) => {
            console.error('Error getting user:', event.target.error);
            reject(event.target.error);
        };
    });
}


export function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        if (!db) await openDatabase();

        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const users = [];

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // Add the user object to the array
                const user = cursor.value;
                users.push(user);
                cursor.continue();
            } else {
                resolve(users);
            }
        };

        transaction.oncomplete = () => {
            resolve(users);
        };

        transaction.onerror = (event) => {
            console.error('Error getting all users:', event.target.error);
            reject(event.target.error);
        };
    });
}



export async function addTask(task) {
    console.log('task', task);
    const database = await openDatabase();

    const transaction = database.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');

    const request = objectStore.add(task);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.error);
    });
}


export async function getAllTasks() {
    const database = await openDatabase();

    const transaction = database.transaction(['tasks'], 'readonly');
    const objectStore = transaction.objectStore('tasks');

    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.error);
    });
}


export async function deleteTask(taskId) {
    const database = await openDatabase();

    const transaction = database.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');

    const request = objectStore.delete(taskId);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.error);
    });
}


export async function updateTaskStatus(taskId, newStatus) {
    const database = await openDatabase();

    const transaction = database.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.get(taskId);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const task = request.result;
            if (task) {
                task.status = newStatus;
                const updateRequest = objectStore.put(task);
                updateRequest.onsuccess = () => resolve(updateRequest.result);
                updateRequest.onerror = (event) => reject(event.error);
            } else {
                reject(new Error('Task not found'));
            }
        };

        request.onerror = (event) => reject(event.error);
    });
}


export async function addAssignee(data) {
    // console.log(data?.newAssignee);
    const database = await openDatabase();
    const transaction = database.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.get(data?.id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const task = request.result;
            if (task) {
                if (!Array.isArray(task.assignedTo)) {
                    task.assignedTo = []; // Ensure it's initialized as an array
                }
                task.assignedTo.push(data?.newAssignee);
                const updateRequest = objectStore.put(task);
                updateRequest.onsuccess = () => resolve(updateRequest.result);
                updateRequest.onerror = (event) => reject(event.error);
            } else {
                reject(new Error('Task not found'));
            }
        };

        request.onerror = (event) => reject(event.error);
    });
}


export async function addTeam(team) {
    const database = await openDatabase();
    const transaction = database.transaction(['teams'], 'readwrite');
    const objectStore = transaction.objectStore('teams');
    const request = objectStore.add(team);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.error);
    });
}


export async function getAllTeams() {
    const database = await openDatabase();
    const transaction = database.transaction(['teams'], 'readonly');
    const objectStore = transaction.objectStore('teams');
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const teams = request.result;
            resolve(teams);
        };

        request.onerror = (event) => {
            reject(event.error);
        };
    });
}



export async function getTasksByStatus(status) {
    const database = await openDatabase();
    const transaction = database.transaction(['tasks'], 'readonly');
    const objectStore = transaction.objectStore('tasks');
    const index = objectStore.index('statusIndex');

    const range = IDBKeyRange.only(status);
    const request = index.openCursor(range);

    return new Promise((resolve, reject) => {
        const filteredTasks = [];

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                filteredTasks.push(cursor.value);
                cursor.continue();
            } else {
                resolve(filteredTasks);
            }
        };

        request.onerror = (event) => {
            reject(event.error);
        };
    });
}


// Function to retrieve a task by due date
export async function getTaskByDueDate(dueDate) {
    const database = await openDatabase();
    const transaction = database.transaction(['tasks'], 'readonly');
    const objectStore = transaction.objectStore('tasks');
    const index = objectStore.index('dueDateIndex');

    const range = IDBKeyRange.only(dueDate);
    const request = index.openCursor(range);

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                resolve(cursor.value);
            } else {
                resolve(null);
            }
        };

        request.onerror = (event) => {
            reject(event.error);
        };
    });
}
