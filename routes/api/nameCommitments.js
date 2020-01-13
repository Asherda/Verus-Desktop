const fs = require('fs-extra');
const _fs = require('graceful-fs');
const fsnode = require('fs');
const Promise = require('bluebird');

module.exports = (api) => {
  api.loadLocalCommitments = () => {
    if (fs.existsSync(`${api.agamaDir}/nameCommits.json`)) {
      let localCommitsJson = fs.readFileSync(`${api.agamaDir}/nameCommits.json`, 'utf8');
      let localCommits
      
      try {
        localCommits = JSON.parse(localCommitsJson);
      } catch (e) {
        api.log('unable to parse local nameCommits.json', 'commitments');
        localCommits = {};
      }

      api.log('commitments set from local file', 'commitments');
      api.writeLog('commitments set from local file');

      return localCommits
    } else {
      api.log('local commitments file is not found, saving empty json file.', 'commitments');
      api.writeLog('local commitments file is not found, saving empty json file.');
      api.saveLocalCommitments({});

      return {};
    }
  };

  api.saveLocalCommitments = (commitments) => {
    const commitmentsFileName = `${api.agamaDir}/nameCommits.json`;

    _fs.access(api.agamaDir, fs.constants.R_OK, (err) => {
      if (!err) {
        const result = 'nameCommits.json write file is done';

        fs.writeFile(commitmentsFileName,
                    JSON.stringify(commitments)
                    .replace(/,/g, ',\n') // format json in human readable form
                    .replace(/":/g, '": ')
                    .replace(/{/g, '{\n')
                    .replace(/}/g, '\n}'), 'utf8', (err) => {
          if (err) {
            return api.log(err);
          } else {
            fsnode.chmodSync(commitmentsFileName, '0666');
            api.log(result, 'commitments');
            api.log(`app nameCommits.json file is created successfully at: ${api.agamaDir}`, 'commitments');
            api.writeLog(`app nameCommits.json file is created successfully at: ${api.agamaDir}`);
          }
        });
      }
    });
  }

  return api;
};