const { MissingParamError } = require('../../utils/errors')
const { InvalidParamError } = require('../../utils/errors')
module.exports = class AuthUseCase {
  accessToken = 'valid_token'
  constructor (userEmailRepository) {
    this.userEmailRepository = userEmailRepository
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    try {
      const user = await this.userEmailRepository.findByEmail(email)
      return user
    } catch {
      throw new InvalidParamError('userEmailRepository')
    }
  }
}
