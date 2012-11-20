var profiles = require('./profiles');

profiles = JSON.stringify(profiles).replace(/name/g, 'fullname');
