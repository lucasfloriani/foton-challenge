import { graphqlUploadKoa } from 'graphql-upload';

const MB = 1000000;

export default graphqlUploadKoa({
  maxFiles: 10,
  maxFileSize: MB * 10,
});
