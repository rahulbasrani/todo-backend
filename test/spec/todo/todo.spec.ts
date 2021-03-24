require("module-alias/register");
import chai from "chai";
import spies from "chai-spies";
chai.use(spies);
import chaiHttp from "chai-http";
import { Application } from "express";
import { respositoryContext, testAppContext } from "../../mocks/app-context";

import { App } from "@server";
import { TodoItem } from "@models";

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

describe("POST /todos", () => {
  it("should create a new todo when non empty title is passed", async () => {
    const res = await chai.request(expressApp).post("/todos").send({
      title: "Testing title new todo",
    });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("id");
    expect(res.body).to.have.property("title");
  });

  it("should return a validation error if title filled is empty string", async () => {
    const res = await chai.request(expressApp).post("/todos").send({
      title: "",
    });
    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.nested.property("failures[0].message")
      .to.equal("Please provide a title");
  });

  it("should return a validation error if title filled is not a string", async () => {
    const res = await chai
      .request(expressApp)
      .post("/todos")
      .send({
        title: { key: "value" },
      });

    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.nested.property("failures[0].message")
      .to.equal("Please specify the valid title");
  });
});

describe("DELETE /todos/:id", () => {
  it("should return a validation error if id is not Mongo id", async () => {
    const res = await chai.request(expressApp).delete("/todos/1");

    expect(res).to.have.status(400);
    expect(res.body)
      .to.have.nested.property("failures[0].message")
      .to.equal("Please specify valid todo id");
  });

  it("should return 204 if todo exists else 404", async () => {
    let todo = await testAppContext.todoRepository.save(
      new TodoItem({ title: "TODO_TEMPORARY" })
    );
    const res1 = await chai.request(expressApp).delete(`/todos/${todo._id}`);
    expect(res1).to.have.status(204);

    const res2 = await chai.request(expressApp).delete(`/todos/${todo._id}`);
    expect(res2).to.have.status(404);
    const res3 = await chai.request(expressApp).delete(`/todos/""`);
    expect(res3).to.have.status(500);
  });
  describe("PUT /todos/:id", () => {
    it("should return 200 if todo exists and title is validately true and 400 if title is empty or not a string else 404", async () => {
      let todo = await testAppContext.todoRepository.save(
        new TodoItem({ title: "TODO_TO_BE_UPDATED" })
      );
      if (todo._id) {
        const res1 = await chai
          .request(expressApp)
          .put(`/todos/${todo._id}`)
          .send({
            title: "TODO",
          });
        expect(res1).to.have.status(200);
  
        const res2 = await chai
          .request(expressApp)
          .put(`/todos/${todo._id}`)
          .send({
            title: "",
          });
        expect(res2).to.have.status(400);
        expect(res2.body)
          .to.have.nested.property("failures[0].message")
          .to.equal("Please specify the valid title");
  
        const res3 = await chai
          .request(expressApp)
          .put(`/todos/${todo._id}`)
          .send({
            title: { key: "value" },
          });
        expect(res3).to.have.status(400);
        expect(res3.body)
          .to.have.nested.property("failures[0].message")
          .to.equal("Please specify the valid title");
      } else {
        const res5 = await chai
          .request(expressApp)
          .put(`/todos/${todo._id}`)
          .send({
            title: "TODO",
          });
        expect(res5).to.have.status(404);
      }
    });
  });
  
  describe("GET /todos/:id", () => {
    it("should get a todo by given id", async () => {
      let todo = await testAppContext.todoRepository.save(
        new TodoItem({ title: "GET_TODO" })
      );
      const res = await chai.request(expressApp).get(`/todos/${todo._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("title");
    });
  
    it("should give response 404", async () => {
      let todo = await testAppContext.todoRepository.save(
        new TodoItem({ title: "GET_TODO" })
      );
  
      await chai.request(expressApp).delete(`/todos/${todo._id}`);
      const res = await chai.request(expressApp).get(`/todos/${todo._id}`);
      expect(res).to.have.status(404);
    });
  });
  
  describe("GET /todos", () => {
    it("should get todos items list", async () => {
      const res = await chai.request(expressApp).get("/todos");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });
});
