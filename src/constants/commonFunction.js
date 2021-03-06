import { GetRequest } from "../api/axiosList";

export const getTopicList = () => {
  const URL = 'http://mooveguru.in/api/btopics'
  const header = {
    accept: 'application/json',
  };
  return GetRequest(URL, header);
};

export const getTopicById = (id) => {
  const URL = `http://mooveguru.in/api/topic/${id}`
  const header = {
    accept: 'application/json',
  };
  return GetRequest(URL, header);
};