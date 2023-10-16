import { type Validation } from '@/presentation/protocols/validation'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null | undefined {
      return null
    }
  }

  return new ValidationStub()
}
