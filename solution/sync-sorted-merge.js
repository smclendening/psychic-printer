'use strict'

const oldestLogBySource = (logSource, index) => {
  const log = logSource.pop();
  return log ? Object.assign(log, { index }) : false;
}

const byDate = (a, b) => {
  return a.date - b.date;
}

const merge = (log, logList) => {
  const start = 0;
  const end = logList.length - 1;

  if (logList.length === 0) {
    return [log];
  }

  if (log.date <= logList[start].date) {
    return [log, ...logList];
  }

  if (log.date >= logList[end].date) {
    return [...logList, log];
  }

  const midIndex = Math.max(1, Math.floor((end - start) / 2)); 

  if (log.date < logList[midIndex].date) {
    const mergeLeft = merge(log, logList.slice(start, midIndex));
    return [...mergeLeft, ...logList.slice(midIndex)];
  } else {
    const mergeRight = merge(log, logList.slice(midIndex));
    return [...logList.slice(start, midIndex), ...mergeRight]; 
  }
}

module.exports = (logSources, printer) => {
  let oldestLogs = logSources.map(oldestLogBySource).sort(byDate);

  while (oldestLogs.length > 0) {
    const oldestLog = oldestLogs.shift();
    const sourceIndex = oldestLog.index;

    printer.print(oldestLog);

    const nextLogFromSource = oldestLogBySource(logSources[sourceIndex], sourceIndex);

    if (nextLogFromSource) {
      oldestLogs = merge(nextLogFromSource, oldestLogs);
    }
  }
 
  printer.done();
}

module.exports.merge = merge;
module.exports.byDate = byDate;