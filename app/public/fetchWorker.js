onmessage = function (event) {
  fetch(event.data.endpoint, {
    ...event.data.requestInit,
    method: 'POST',
    headers: {
      ...event.data.requestInit?.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: event.data.query,
      variables: event.data.variables,
    }),
  })
    .then((res) => res.json())
    .then(({ data, errors }) => {
      if (!!errors) {
        if (Array.isArray(errors)) {
          postMessage({
            error: {
              type: 'MantleError',
              errors,
            },
          });
        } else {
          postMessage({
            error: {
              type: 'Error',
              error: String(errors),
            },
          });
        }
      } else {
        postMessage({
          data,
        });
      }
    });
};
