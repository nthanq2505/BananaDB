const {
  getDataFromRequest,
  readJSONFile,
  writeJSONFile
} = require('../utils/helpers')
const {
  folderPaths,
  fileExtensions,
  httpStatusCodes
} = require('../utils/constants')

function getCollectionDatabasePath (colectionName) {
  return `${folderPaths.DATABASE}/${colectionName}${fileExtensions.JSON}`
}

async function handleRead (request, response) {
  try {
    const data = await getDataFromRequest(request)
    const { collection, filter } = data
    const path = getCollectionDatabasePath(collection)

    const records = await readJSONFile(path)
    const filteredRecords = records.filter(record =>
      Object.keys(filter).every(key => record[key] === filter[key])
    )

    response.writeHead(httpStatusCodes.OK, {
      'Content-Type': 'application/json'
    })
    response.write(JSON.stringify(filteredRecords))
  } catch (err) {
    response.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, {
      'Content-Type': 'text/plain'
    })
    response.write('500 Internal Server Error\n')
  } finally {
    response.end()
  }
}

async function handleCreate (request, response) {
  try {
    const data = await getDataFromRequest(request)
    const { collection, record } = data
    const path = getCollectionDatabasePath(collection)

    const records = await readJSONFile(path)
    records.push(record)

    await writeJSONFile(path, records)

    response.writeHead(httpStatusCodes.CREATED, {
      'Content-Type': 'application/json'
    })
  } catch (err) {
    response.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, {
      'Content-Type': 'text/plain'
    })
    response.write('500 Internal Server Error\n')
  } finally {
    response.end()
  }
}

async function handleUpdate (request, response) {
  try {
    const data = await getDataFromRequest(request)

    const { collection, filter, update } = data
    const path = getCollectionDatabasePath(collection)

    const records = await readJSONFile(path)

    const updatedRecords = records.map(record => {
      let match = true
      for (const key in filter) {
        if (record[key] !== filter[key]) {
          match = false
          break
        }
      }
      return match ? { ...record, ...update } : record
    })

    await writeJSONFile(path, updatedRecords)

    response.writeHead(httpStatusCodes.NO_CONTENT)
  } catch (err) {
    console.error('Error:', err)
    response.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, {
      'Content-Type': 'text/plain'
    })
    response.write('500 Internal Server Error\n')
  } finally {
    response.end()
  }
}

async function handleDelete (req, res) {
  try {
    const data = await getDataFromRequest(req)
    const { collection, filter } = data
    const path = getCollectionDatabasePath(collection)
    const records = await readJSONFile(path)

    const updatedRecords = records.filter(record => {
      let match = true
      for (const key in filter) {
        if (record[key] !== filter[key]) {
          match = false
          break
        }
      }
      return !match
    })

    await writeJSONFile(path, updatedRecords)
    res.writeHead(httpStatusCodes.NO_CONTENT)
  } catch (err) {
    console.error('Error:', err)
    res.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, {
      'Content-Type': 'text/plain'
    })
    res.write('500 Internal Server Error\n')
  } finally {
    res.end()
  }
}

module.exports = {
  handleRead,
  handleCreate,
  handleUpdate,
  handleDelete
}
