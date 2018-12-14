import graph from 'fbgraph';

const getUserId = async (token) => {
  let id = 0;

  const options = {
    timeout: 3000,
    pool: { maxSockets: Infinity },
    headers: { connection: 'keep-alive' },
  };

  // need to use this hack to wait for user id
  async function start() {
    let promise = await new Promise((resolve, reject) => {
      graph.setOptions(options).get('me', (err, res) => {
        id = res.id;
        resolve();
      });
    }).catch((err) => {
      throw err;
    });

    return promise;
  }

  await start()
    .then(() => {})
    .catch(() => {});

  return id;
};

export default { getUserId };
