const express = require('express');

const router = express.Router();
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

router.get('/', (req, res) => {
  //----------------------------------------
  Actions.get(req.query)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ erroMessage: 'Could not get all the actions' });
    });
});

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
  // do your magic!
  Actions.update(req.params.id, req.body)
    .then(action => {
      res.status(200).json(req.body);
    })
    .catch(err => console.log(err));
});

router.delete('/:id', validateActionId, (req, res) => {
  // do your magic!
  Actions.get(req.params.id).then(action => {
    if (action) {
      Actions.remove(req.params.id)
        .then(count => {
          if (count) {
            res.status(200).json(action);
          }
        })
        .catch(err => console.log(err));
    }
  });
});

function validateActionId(req, res, next) {
  Actions.get(req.params.id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({ message: 'This Action is not found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retreiving the Action' });
    });
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
