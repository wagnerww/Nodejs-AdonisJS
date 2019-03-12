'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '20mb' })
      const fileName = `${Date.now()}.${upload.subtype}`
      console.log('chegou', fileName)
      console.log('up', upload)
      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        console.log('erro', upload.error())
        throw upload.error()
      }
      console.log('upload', upload)
      const file = File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro no upload de arquivos' } })
    }
  }
}

module.exports = FileController
