require('module-alias/register');

import chai from 'chai';

import spies from 'chai-spies';
chai.use(spies);
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { respositoryContext, testAppContext } from '../../mocks/app-context';

import { App } from '@server';
import { TodoItem } from '@models';

chai.use(chaiHttp);
const expect = chai.expect;
let expressApp: Application;

before(async () => {
  await respositoryContext.store.connect();
  const app = new App(testAppContext);
  app.initializeMiddlewares();
  app.initializeControllers();
  app.initializeErrorHandling();
  expressApp = app.expressApp;
});

describe('POST /todos', () => {
  it('should create a new todo when non empty title is passed', async () => {
    const res = await chai.request(expressApp).post('/todos').send({
      title: 'Testing title new todo',
    });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('title');
  });

  it('should return a validation error if title is empty string', async () => {
    const res = await chai.request(expressApp).post('/todos').send({
      title: '',
    });
    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.nested.property('failures[0].message')
      .to.equal('Please provide a title');
  });

  it('should return a validation error if title is not a string', async () => {
    const res = await chai
      .request(expressApp)
      .post('/todos')
      .send({
        title: { key: 'value' },
      });

    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.nested.property('failures[0].message')
      .to.equal('Please specify the valid title');
  });
});

describe('DELETE /todos/:id', () => {
  it('should return a validation error if id is not Mongo id', async () => {
    const res = await chai.request(expressApp).delete('/todos/1');

    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.nested.property('failures[0].message')
      .to.equal('Please specify valid todo id');
  });

  it('should return 204 if todo exists else 404', async () => {
    let todo = await testAppContext.todoRepository.save(
      new TodoItem({ title: 'TODO_TEMPORARY' })
    );
    const res1 = await chai.request(expressApp).delete(`/todos/${todo._id}`);
    expect(res1).to.have.status(204);

    const res2 = await chai.request(expressApp).delete(`/todos/${todo._id}`);
    expect(res2).to.have.status(404);
  });
});
