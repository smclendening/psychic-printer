'use strict'

const oldestEntryBySource = (logSource, index) => {
  const entry = logSource.pop();
  return {entry, index};
}

const byDate = (a, b) => {
  return a.entry.date - b.entry.date;
}

module.exports = (logSources, printer) => {
  const oldestLogs = logSources.map(oldestEntryBySource).sort(byDate);

}