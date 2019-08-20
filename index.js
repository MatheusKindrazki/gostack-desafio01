const express = require('express');

const app = express();

app.use(express.json());

const projects = [];
let numberOfRequests = 0;

// Middlewares

function checkProjectIfExists( req, res, next ) {
  
  const { id } = req.params;
  const project = projects.find(project => project.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

function countRequests( req, res, next ) {
  numberOfRequests++;

  console.log(`Number of calls in api:  ${numberOfRequests}`);

  return next();
}

app.use(countRequests);


// Project route

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

app.put('/projects/:id', checkProjectIfExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.title = title;

  return res.json(project);
});

app.delete('/projects/:id', checkProjectIfExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  projects.splice(projectIndex, 1);

  return res.send('successful removal');
});

// Add task

app.post('/projects/:id/tasks', checkProjectIfExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.listen(3333);