const promiseEvent = (emitter, eventName, predicate) => {
  return new Promise(resolve => {
    const handleEvent = event => {
      if (!!predicate && !predicate(event)) return;
      emitter.removeListener(eventName, handleEvent);
      resolve(event);
    };
    emitter.addListener(eventName, handleEvent);
  });
};

export default promiseEvent;
