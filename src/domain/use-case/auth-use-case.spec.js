// class AuthUseCase {
//   accessToken = 'valid_token'
//   async auth (email, password) {
//     this.email = email
//     this.password = password
//     return this.accessToken
//   }

const { MissingParamError } = require('../../utils/errors')

// }
class AuthUseCase {
  accessToken = 'valid_token'
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const sut = new AuthUseCase()
    sut.accessToken = null
    const ps = sut.auth()
    expect(ps).rejects.toThrow()
  })
})
