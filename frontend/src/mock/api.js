
export const mockApi = (data, delay = 800) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error("Network error occurred. Please try again."));
      } else {
        resolve(data);
      }
    }, delay);
  });
};
