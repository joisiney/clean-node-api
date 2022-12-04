const { MissingParamError } = require('../../utils/errors')

const makeAuthUseCase = () => {
  class AuthUseCase {
    accessToken = 'valid_token'
    constructor (userEmailReposotiry) {
      this.userEmailReposotiry = userEmailReposotiry
    }

    async auth (email, password) {
      if (!email) throw new MissingParamError('email')
      if (!password) throw new MissingParamError('password')
      this.userEmailReposotiry.findByEmail(email)
    }
  }
  const userEmailReposotiry = makeFindUserEmailReposotirySpy()
  const sut = new AuthUseCase(userEmailReposotiry)
  return { sut, userEmailReposotiry }
}
const makeFindUserEmailReposotirySpy = () => {
  class FindUserEmailReposotirySpy {
    async findByEmail (email) {
      this.email = email
    }
  }
  const userEmailReposotiry = new FindUserEmailReposotirySpy()
  return userEmailReposotiry
}
describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const { sut } = makeAuthUseCase()
    sut.accessToken = null
    const ps = sut.auth()
    expect(ps).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw null if no password is provided', async () => {
    const { sut } = makeAuthUseCase()
    sut.accessToken = null
    const ps = sut.auth('email@gmail.com')
    expect(ps).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call FindUserEmailReposotiry with correct mail', async () => {
    const { sut, userEmailReposotiry } = makeAuthUseCase()
    await sut.auth('email@gmail.com', '123')
    expect(userEmailReposotiry.email).toBe('email@gmail.com')
  })
})
