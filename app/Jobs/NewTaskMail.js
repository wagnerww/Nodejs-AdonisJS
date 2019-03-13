'use strict'
const Mail = use('Mail')
// const Helpers = use('Helpers')

class NewTaskMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewTaskMail-job'
  }

  // This is where the work is done.
  async handle ({ username, title, file, email }) {
    console.log(`job: ${NewTaskMail.key}`)
    await Mail.send(
      ['emails.news_task'],
      { username, title, hasAttachment: !!file },
      message => {
        message
          .to(email)
          .from('wagnerricardonet@gmail.com', 'Wagner Ricardo')
          .subject('Nova tarefa')

        if (file) {
          /* Esta funcionando, porém comentei pq o meu anexo é mto pesado
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          }) */
        }
      }
    )
  }
}

module.exports = NewTaskMail
