const { MissingParamError } = require('../../utils/errors')
const { InvalidParamError } = require('../../utils/errors')
const { AuthUseCase } = require('./')
const makeAuthUseCase = (userEmailRepository) => {
  const sut = new AuthUseCase(userEmailRepository)
  return { sut }
}
const makeFindUserEmailRepositorySpy = () => {
  class FindUserEmailRepositorySpy {
    async findByEmail (email) {
      this.email = email
      return null
    }
  }
  const userEmailRepository = new FindUserEmailRepositorySpy()
  return userEmailRepository
}
describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const { sut } = makeAuthUseCase(makeFindUserEmailRepositorySpy())
    sut.accessToken = null
    const ps = sut.auth()
    expect(ps).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw null if no password is provided', async () => {
    const { sut } = makeAuthUseCase(makeFindUserEmailRepositorySpy())
    sut.accessToken = null
    const ps = sut.auth('email@gmail.com')
    expect(ps).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call FindUserEmailRepository with correct mail', async () => {
    const userEmailRepository = makeFindUserEmailRepositorySpy()
    const { sut } = makeAuthUseCase(userEmailRepository)
    await sut.auth('email@gmail.com', '123')
    expect(userEmailRepository.email).toBe('email@gmail.com')
  })
  test('Should throw if no FindUserEmailRepository is provided', async () => {
    const { sut } = makeAuthUseCase()
    const ps = sut.auth('email@gmail.com', '123')
    expect(ps).rejects.toThrow(new InvalidParamError('userEmailRepository'))
  })
  test('Should return null FindUserEmailRepository return null', async () => {
    const { sut } = makeAuthUseCase(makeFindUserEmailRepositorySpy())
    const accessToken = await sut.auth('email@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
})
