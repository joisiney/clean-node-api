const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  accessToken = 'valid_token'
  constructor (userEmailRepository, encrypter) {
    this.userEmailRepository = userEmailRepository
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    const user = await this.userEmailRepository.findByEmail(email)
    if (!user) return null
    await this.encrypter.compare(password, user.password)
    return null
  }
}
