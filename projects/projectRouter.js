const express = require('express');

const router = express.Router();
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

router.get('/', (req, res) => {
  //----------------------------------------
  // res.send('hello world');
  console.log(req.params);
  Projects.get()
    .then(projects => {
      console.log(projects);
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ erroMessage: 'Could not get all the projects' });
    });
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(actions => {
      res.status(200).json({ actions });
    })
    .catch(err => console.log(err));
});

router.post('/', validateProject, (req, res) => {
  Projects.insert(req.body).then(project => {
    res.status(210).json(project);
  });
});

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
  const actionInfo = { ...req.body, project_id: req.params.id };

  Actions.insert(actionInfo)
    .then(action => {
      res.status(210).json(action);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ erroMessage: 'Needs project id' });
    });
});

router.put('/:id', validateProjectId, validateAction, (req, res) => {
  // do your magic!
  Projects.update(req.params.id, req.body)
    .then(project => {
      res.status(200).json(req.body);
    })
    .catch(err => console.log(err));
});

router.delete('/:id', validateProjectId, (req, res) => {
  // do your magic!
  Projects.get(req.params.id).then(project => {
    if (project) {
      Projects.remove(req.params.id)
        .then(count => {
          if (count) {
            res.status(200).json(project);
          }
        })
        .catch(err => console.log(err));
    }
  });
});

//custom middleware
function validateProjectId(req, res, next) {
  Projects.get(req.params.id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: 'This Project is not found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retreiving the Project' });
    });
}

function validateProject(req, res, next) {
  const project = req.body;
  if (project) {
    if (project.name || project.description) {
      next();
    } else {
      res
        .status(400)
        .json({ erroMessage: 'Insert a proper name and description' });
    }
  } else {
    res.status(400).json({ erroMessage: 'Need the requirements' });
  }
}

function validateAction(req, res, next) {
  const action = req.body;
  if (action) {
    if (action.description || action.notes) {
      next();
    } else {
      res.status(400).json({ erroMessage: 'Insert a proper description' });
    }
  } else {
    res.status(400).json({ erroMessage: '' });
  }
}

module.exports = router;
