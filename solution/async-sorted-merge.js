'use strict'

const byDate = require('./sync-sorted-merge').byDate;
const merge = require('./sync-sorted-merge').merge;

const oldestLogBySourceAsync = async (logSource, index) => {
  const log = await logSource.popAsync()
  return log ? Object.assign(log, { index }) : false;
}

const retrieveOldestLogs = async asyncPops => {
  const logs = await Promise.all(asyncPops)
  return logs.filter(log => log !== false).sort(byDate);
}

module.exports = async (logSources, printer) => {

  let oldestLogs = await retrieveOldestLogs(logSources.map(oldestLogBySourceAsync))

  while (oldestLogs.length > 0) {
    const oldestLog = oldestLogs.shift();
    const sourceIndex = oldestLog.index;

    printer.print(oldestLog);

    const nextLogFromSource = await oldestLogBySourceAsync(logSources[sourceIndex], sourceIndex);

    if (nextLogFromSource) {
      oldestLogs = merge(nextLogFromSource, oldestLogs);
    }
  }

  printer.done();
}