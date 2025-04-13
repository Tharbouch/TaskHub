import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions to read and write to the database
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        throw new Error('Database read error');
    }
}

async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to database:', error);
        throw new Error('Database write error');
    }
}

// API Routes for Tasks
// GET all tasks with optional projectId filter
app.get('/tasks', async (req, res) => {
    try {
        const db = await readDatabase();
        let tasks = db.tasks;

        // Filter by projectId if provided
        const { projectId } = req.query;
        if (projectId) {
            tasks = tasks.filter(task => task.projectId === parseInt(projectId));
        }

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET a specific task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const db = await readDatabase();

        const task = db.tasks.find(task => task.id === taskId);
        if (!task) {
            return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// PATCH update a task
app.patch('/tasks/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const updates = req.body;
        const db = await readDatabase();

        const taskIndex = db.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        // Update only the provided fields
        db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...updates };

        await writeDatabase(db);

        console.log(`Task ${taskId} updated successfully:`, db.tasks[taskIndex]);
        res.json(db.tasks[taskIndex]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// POST - create a new task
app.post('/tasks', async (req, res) => {
    try {
        const { projectId, title, description, status = "to_do", priority = "medium" } = req.body;

        // Validate required fields
        if (!projectId || !title || !description) {
            return res.status(400).json({
                error: 'ProjectId, title and description are required'
            });
        }

        const db = await readDatabase();

        // Check if project exists
        const projectExists = db.projects.some(project => project.id === parseInt(projectId));
        if (!projectExists) {
            return res.status(400).json({ error: `Project with ID ${projectId} does not exist` });
        }

        // Find the next available ID
        const maxId = db.tasks.reduce((max, task) => Math.max(max, task.id), 0);
        const newId = maxId + 1;

        // Create new task object
        const newTask = {
            id: newId,
            projectId: parseInt(projectId),
            title,
            description,
            status,
            priority,
            createdAt: new Date().toISOString()
        };

        // Add to database
        db.tasks.push(newTask);
        await writeDatabase(db);

        // Return the newly created task
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// API Routes for Projects
app.get('/projects', async (req, res) => {
    try {
        const db = await readDatabase();
        let projects = db.projects;

        const { status } = req.query;
        if (status) {
            projects = projects.filter(project => project.status === status);
        }

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});


app.get('/projects/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const db = await readDatabase();

        const project = db.projects.find(project => project.id === projectId);
        if (!project) {
            return res.status(404).json({ error: `Project with ID ${projectId} not found` });
        }

        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// POST - create a new project
app.post('/projects', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const db = await readDatabase();

        // Find the next available ID
        const maxId = db.projects.reduce((max, project) => Math.max(max, project.id), 0);
        const newId = maxId + 1;

        // Create new project object
        const newProject = {
            id: newId,
            name,
            description,
            createdAt: new Date().toISOString()
        };

        // Add to database
        db.projects.push(newProject);
        await writeDatabase(db);

        // Return the newly created project
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// PATCH - update a project
app.patch('/projects/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const updates = req.body;
        const db = await readDatabase();

        const projectIndex = db.projects.findIndex(project => project.id === projectId);
        if (projectIndex === -1) {
            return res.status(404).json({ error: `Project with ID ${projectId} not found` });
        }

        // Update only the provided fields
        db.projects[projectIndex] = { ...db.projects[projectIndex], ...updates };

        await writeDatabase(db);

        console.log(`Project ${projectId} updated successfully:`, db.projects[projectIndex]);
        res.json(db.projects[projectIndex]);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE - delete a project and its tasks
app.delete('/projects/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const db = await readDatabase();

        const projectIndex = db.projects.findIndex(project => project.id === projectId);
        if (projectIndex === -1) {
            return res.status(404).json({ error: `Project with ID ${projectId} not found` });
        }

        // Remove the project
        db.projects.splice(projectIndex, 1);

        // Remove all tasks associated with this project
        db.tasks = db.tasks.filter(task => task.projectId !== projectId);

        await writeDatabase(db);

        res.status(200).json({ message: `Project ${projectId} and all its tasks deleted successfully` });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/tasks and http://localhost:${PORT}/projects`);
});