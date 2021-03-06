import { create, isCancel } from 'axios';

const client = create({
  timeout: 60000,
  crossDomain: true,
});

export default client;