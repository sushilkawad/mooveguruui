import { GetRequest } from "../api/axiosList";
import { apiBaseURL } from "../config/config";

export const getTopicList = () => {
  const URL = `${apiBaseURL}/btopics`
  const header = {
    accept: 'application/json',
  };
  return GetRequest(URL, header);
};

export const getTopicById = (id) => {
  const URL = `${apiBaseURL}/topic/${id}`
  const header = {
    accept: 'application/json',
  };
  return GetRequest(URL, header);
};