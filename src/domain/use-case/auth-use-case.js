const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  accessToken = 'valid_token'
  constructor (userEmailRepository, encrypter, tokenGenerator) {
    this.userEmailRepository = userEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    const user = await this.userEmailRepository.findByEmail(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (!isValid) return null
    const accessToken = await this.tokenGenerator.generate(user.id)
    return accessToken
  }
}
