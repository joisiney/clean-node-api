const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  accessToken = 'valid_token'
  constructor (userEmailRepository) {
    this.userEmailRepository = userEmailRepository
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    const user = await this.userEmailRepository.findByEmail(email)
    if (!user) return null
    return null
  }
}
