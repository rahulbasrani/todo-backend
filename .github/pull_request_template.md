## Description

Create API for todo task POST /todos

## Database schema changes

Model Todo add.
Schema:
{
title: { type: String, required: true }
},
{
collection: 'todos',
timestamps: {
createdAt: 'createdAt',
updatedAt: 'updatedAt',
},
}

## Tests

### Automated test cases added

- POST /todos
  input: {title: 'Testing title new todo'}
  output: success

- POST /todos
  input: {title: ''}
  output: fail

### Manual test cases run

NA
