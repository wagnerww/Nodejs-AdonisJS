'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('wagnerricardonet@gmail.com | adonisjs')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { messagem: 'Algo não deu certo, o email existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()
      const user = await User.findByOrFail('token', token)
      // Se a data do moment for maior que 2 dias, é por que expirou
      const tokenEspired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenEspired) {
        return response
          .status(401)
          .send({ error: { messagem: 'O token está expirado' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { messagem: 'Algo deu errado ao resetar a senha' } })
    }
  }
}

module.exports = ForgotPasswordController
