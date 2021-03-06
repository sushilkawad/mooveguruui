import client from './axiosClient';

export const putRequest = (url, data, notificationConf) => client({
  method: 'put',
  url,
  data,
  customparams: { showLoading: true, notificationConf },
});

export const postRequest = (url, headers, data, notificationConf) => client({
  method: 'post',
  url,
  data,
  headers,
  customparams: { showLoading: true, notificationConf },
});

export const getRequest = (url, isShowLoading, notificationConf, headerObj) => client({
  method: 'get',
  url,
  data: {},
  headers: headerObj,
  customparams: { showLoading: isShowLoading, notificationConf },
});

export const deleteRequest = (url, data, notificationConf) => client({
  method: 'delete',
  url,
  data,
  customparams: { showLoading: true, notificationConf },
});

export const patchRequest = (url, data, notificationConf) => client({
  method: 'patch',
  url,
  data,
  customparams: { showLoading: true, notificationConf },
});
