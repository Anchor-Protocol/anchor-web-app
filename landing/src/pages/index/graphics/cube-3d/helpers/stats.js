import Stats from 'stats.js';

function createStats() {
  if (process.env.NODE_ENV) {
    const stats = new Stats();

    stats.showPanel(0);

    document.body.appendChild(stats.dom);

    return {
      begin: () => {
        stats.begin();
      },
      end: () => {
        stats.end();
      },
    };
  }

  return {
    begin: () => {},
    end: () => {},
  };
}

export const stats = createStats();
