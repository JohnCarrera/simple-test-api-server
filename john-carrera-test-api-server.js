const http = require('http');

let clientData = [];

const server = http.createServer(async (req, res) => {

  const loader = [];


  for await (const chunk of req) {
    loader.push(chunk);
  }

  const data = Buffer.concat(loader).toString();

  switch (req.method) {

    case 'GET':

      console.log('client requesting data...')
      console.log(`data: [ ${clientData} ]`);

      if (!clientData.length) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/css");
        res.write('No data is stored.');
        console.log('No data is stored.');
        return res.end();
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/css");
        res.write(`stored data:\n\n`)
        res.write(`[ ${clientData} ]`);
        return res.end();
      }
    case 'POST':
      console.log('client is creating new data...');
      console.log('request body:', data);
      console.log(`data: [ ${clientData} ]`);

      let prevData = clientData;
      res.statusCode = 201;
      res.setHeader("Content-Type", "text/css");
      clientData = data.split(',');
      console.log('client data updated.')
      console.log(`data: [ ${clientData} ]`);
      res.write(`Replaced previous data: \n\n`)
      res.write(`[ ${prevData.length ? prevData : '<empty>'} ]`)
      res.write(`${prevData}\n\nwith new data: \n\n[ ${clientData} ]`)
      return res.end();

    case 'PATCH':
      console.log('client is adding to existing data...');
      console.log('request body:', data);
      console.log(`data: [ ${clientData} ]`);

      if (!clientData.length) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/css");
        res.write('No data is stored. \n\nPlease use POST method to create data.');
        console.log('Unable complete client request, no data is stored.')
        console.log(`data: [ ${clientData} ]`);
        return res.end();
      } else {
        res.statusCode = 201;
        res.setHeader("Content-Type", "text/css");
        clientData = clientData.concat(data.split(','));
        console.log('client data updated.')
        console.log(`data: [ ${clientData} ]`);
        res.write(`added requested data.\nNew data:\n\n`)
        res.write(`[ ${clientData} ]`);
        return res.end();
      }

    case 'DELETE':
      console.log('client is deleting from existing data...');
      console.log('request body:', data);
      console.log(`data: [ ${clientData} ]`);

      if (!clientData.length) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/css");
        res.write('No data is stored. \n\nPlease use POST method to create data before deleting.');
        console.log('Unable to delete from data, no data is stored.')
        console.log(`data: [ ${clientData} ]`);
        return res.end();
      } else {

        res.setHeader("Content-Type", "text/css");

        let found = false;
        clientData.forEach(el => {
          if (el === data) {
            found = true;
          }
        });

        if (found) {
          res.statusCode = 201;
          clientData.splice(clientData.indexOf(data), 1);
          console.log('client data entry removed.')
          console.log(`data: [ ${clientData} ]`);
          res.write(`deleted requested data entry.\nNew data:\n\n`)
          res.write(`[ ${clientData} ]`);
          return res.end();
        } else {
          res.statusCode = 404;
          console.log('Unable to delete from data, no matching entry found.')
          console.log(`data: [ ${clientData} ]`);
          res.write(`Unable to delete requested data entry. No match Found\n\n`)
          res.write(`Request: ${data}\n`);
          res.write(`Stored data:[ ${clientData} ]`);
          return res.end();
        }
      }

    default:
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/css");
      console.log('client has issued a request with an unsupported method');
      console.log('request body:', data);
      res.write(`ERROR: unsupported method: ${req.method}`)
      return res.end();
  }

});

const port = 8000;

server.listen(port, () => console.log(`Server is listening on port ${port}`));
