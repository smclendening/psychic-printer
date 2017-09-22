'use strict'

const { byDate, merge } = require('./sync-sorted-merge')

const oldestLogBySourceAsync = async (logSource, index) => {
  try {
    const log = await logSource.popAsync()
    return log ? Object.assign(log, { index }) : false;
  }

  catch(error) {
    throw error;
  }
}

const retrieveOldestLogs = async asyncPops => {
  try {
    const logs = await Promise.all(asyncPops)
    return logs.filter(log => log !== false).sort(byDate);
  }

  catch(error) {
    throw error;
  }
}

module.exports = async (logSources, printer) => {

  try {
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
    
  } 

  catch (error) {
    console.error(error);
  }


  printer.done();
}