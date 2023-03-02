const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE-341-Final-Group5-ToDoList',
    description: 'Group 5 final project, Advanced todo list',
  },
  host: 'https://cse-341-final-group5-todolist.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/, ./routes, ./routes'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./server.js');
// });
