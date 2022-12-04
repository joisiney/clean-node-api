const { MissingParamError } = require('../../utils/errors')
const { AuthUseCase } = require('./')
const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    accessToken = 'any_token'
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGenerator = new TokenGeneratorSpy()
  return tokenGenerator
}
const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepository {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  const updateAccessTokenRepository = new UpdateAccessTokenRepository()
  return updateAccessTokenRepository
}
const makeEncrypter = () => {
  class EncrypterSpy {
    isValid = true
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  return encrypterSpy
}
const makeSut = () => {
  const userEmailRepository = makeFindUserEmailRepositorySpy()
  const encrypter = makeEncrypter()
  const tokenGenerator = makeTokenGenerator()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()
  const sut = new AuthUseCase(userEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository)
  return { sut, userEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository }
}
const makeFindUserEmailRepositorySpy = () => {
  class FindUserEmailRepositorySpy {
    user = {
      password: 'hashed_password',
      id: 'any_id'
    }

    async findByEmail (email) {
      this.email = email
      return this.user
    }
  }
  const userEmailRepository = new FindUserEmailRepositorySpy()
  return userEmailRepository
}

describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const { sut } = makeSut()
    sut.accessToken = null
    const ps = sut.auth()
    expect(ps).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw null if no password is provided', async () => {
    const { sut } = makeSut()
    sut.accessToken = null
    const ps = sut.auth('email@gmail.com')
    expect(ps).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call FindUserEmailRepository with correct mail', async () => {
    const { sut, userEmailRepository } = makeSut()
    await sut.auth('email@gmail.com', '123')
    expect(userEmailRepository.email).toBe('email@gmail.com')
  })
  test('Should throw if no FindUserEmailRepository is provided', async () => {
    const { sut } = makeSut()
    sut.userEmailRepository = null
    const ps = sut.auth('email@gmail.com', '123')
    expect(ps).rejects.toThrow()
  })
  test('Should return null FindUserEmailRepository return null', async () => {
    const { sut, userEmailRepository } = makeSut()
    userEmailRepository.user = null
    const accessToken = await sut.auth('email@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid email is provided', async () => {
    const { sut, encrypter } = makeSut()
    encrypter.isValid = false
    const accessToken = await sut.auth('invalid@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypter } = makeSut()
    encrypter.isValid = false
    const accessToken = await sut.auth('valid@gmail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypter, userEmailRepository } = makeSut()
    await sut.auth('valid@gmail.com', 'hashed_password')
    expect(encrypter.password).toBe('hashed_password')
    expect(encrypter.hashedPassword).toBe(userEmailRepository.user.password)
  })
  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, userEmailRepository, tokenGenerator } = makeSut()
    await sut.auth('valid@gmail.com', 'valid_password')
    expect(tokenGenerator.userId).toBe(userEmailRepository.user.id)
  })
  test('Should return accessToken is correct credentials are provided', async () => {
    const { sut, tokenGenerator } = makeSut()
    const accessToken = await sut.auth('valid@gmail.com', 'valid_password')
    expect(accessToken).toBe(tokenGenerator.accessToken)
    expect(accessToken).toBeTruthy()
  })
  test('Should call UpdateAccessTokenReposotiry with correct values', async () => {
    const { sut, tokenGenerator, updateAccessTokenRepository } = makeSut()
    await sut.auth('valid@gmail.com', 'valid_password')
    expect(updateAccessTokenRepository.userId).toBe(tokenGenerator.userId)
    expect(updateAccessTokenRepository.accessToken).toBe(tokenGenerator.accessToken)
  })
})
