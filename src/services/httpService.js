import http from "axios";

http.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("Loggin the error", error);
    alert("An unexpected error occurred.");
  }
  return Promise.reject(error);
});

const httpMethods = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
};

export default httpMethods;
