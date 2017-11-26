const { Observable } = require('rxjs');

const net = require('net');

exports.waitForPort = function waitForPort(port, address) {
  return Observable.create(observer => {
    let s;

    function connect() {
      s = new net.Socket();
      s.connect(port, address, () => {
        s.destroy();

        observer.next('ok');
        observer.complete();
      });
      s.on('error', () => {
        s.destroy();
        setTimeout(connect, 100);
      });
      s.setTimeout(100, () => {
        s.destroy();
        setTimeout(connect, 1);
      });
    }

    connect();
    return () => {
      s.destroy();
    };
  });
};
