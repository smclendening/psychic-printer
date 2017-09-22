'use strict'

const oldestLogBySource = (logSource, index) => {
  const log = logSource.pop();
  return Object.assign(log, { index });
}

const byDate = (a, b) => {
  return a.date - b.date;
}

const merge = (log, logList, start, end) => {
  // if log is older than start, return new array with log at beginning

  // if log is younger than end, return new array with log at end 
}

module.exports = (logSources, printer) => {
  const oldestLogs = logSources.map(oldestLogBySource).sort(byDate);

  // while oldestLogs length > 0
  while (oldestLogs.length > 0) {
    // retrieve oldestLog and print
    const oldestLog = oldestLogs.shift();
    const sourceIndex = oldestLog.index;
    printer.print(oldestLog);
    // retrieve next oldest log from that index
    const nextLogFromSource = oldestLogBySource(logSources[sourceIndex], sourceIndex);

    if (nextLogFromSource) {
      // merge next oldest log with oldestLogs
      oldestLogs = merge(nextLogFromSource, oldestLogs, 0, oldestLogs.length - 1);
    }
  }
 // printer.done();
}