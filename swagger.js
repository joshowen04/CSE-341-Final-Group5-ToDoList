const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE-341-Final-Group5-ToDoList',
    description: 'Group 5 final project, Advanced todo list'
  },
  host: 'cse-341-final-group5-todolist.onrender.com',
  //   host: 'localhost:3000',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./server.js');
// });
